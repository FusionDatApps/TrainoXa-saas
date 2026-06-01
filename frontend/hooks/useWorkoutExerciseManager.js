"use client";

import { useCallback, useState } from "react";

import { apiFetch } from "../lib/api";

import {
  getAddExerciseErrorMessage,
  getRemoveExerciseErrorMessage,
  getReorderExerciseErrorMessage,
  getUpdateExerciseErrorMessage,
} from "../lib/workout-exercise-feedback";

const UNDO_DURATION = 10000;

function cloneWorkoutItems(items = []) {
  if (typeof structuredClone === "function") {
    return structuredClone(items);
  }

  return JSON.parse(JSON.stringify(items));
}

function buildUndoActionId(type, workoutId) {
  return `${type}-${workoutId}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export default function useWorkoutExerciseManager({
  exercises = [],
  toast,
}) {
  const [selectedExercises, setSelectedExercises] = useState({});
  const [workoutExercises, setWorkoutExercises] = useState({});
  const [addingExercise, setAddingExercise] = useState({});
  const [updatingExercise, setUpdatingExercise] = useState({});
  const [removingExercise, setRemovingExercise] = useState({});
  const [reorderingWorkout, setReorderingWorkout] = useState({});
  const [undoStack, setUndoStack] = useState([]);
  const [exerciseFeedback, setExerciseFeedback] = useState({});
  const [pendingRemoveExercise, setPendingRemoveExercise] = useState(null);

  const setWorkoutFeedback = useCallback((workoutId, type, message) => {
    setExerciseFeedback((prev) => ({
      ...prev,
      [workoutId]: {
        type,
        message,
      },
    }));
  }, []);

  const removeUndoAction = useCallback((actionId) => {
    setUndoStack((prev) =>
      prev.filter((action) => action.id !== actionId)
    );
  }, []);

  const reorderWorkoutExercisesRequest = useCallback(
    async ({ workoutId, items }) => {
      return apiFetch(`/workouts/${workoutId}/exercises/reorder`, {
        method: "PATCH",
        body: JSON.stringify({
          items,
        }),
      });
    },
    []
  );

  const loadWorkoutExercises = useCallback(async (workoutId) => {
    try {
      const res = await apiFetch(`/workouts/${workoutId}/exercises`);

      setWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: (res.data || []).sort(
          (a, b) => a.exerciseOrder - b.exerciseOrder
        ),
      }));
    } catch (err) {
      console.error("Error cargando ejercicios de rutina:", err.message);
    }
  }, []);

  const restoreUndoAction = useCallback(
    async (actionId) => {
      const action = undoStack.find((item) => item.id === actionId);

      if (!action) {
        toast?.warning({
          title: "Acción no disponible",
          message: "El tiempo para deshacer esta acción ya expiró.",
        });

        return;
      }

      removeUndoAction(actionId);

      const snapshot = cloneWorkoutItems(action.snapshot || []);

      setReorderingWorkout((prev) => ({
        ...prev,
        [action.workoutId]: true,
      }));

      setWorkoutExercises((prev) => ({
        ...prev,
        [action.workoutId]: snapshot.map((item) => ({
          ...item,
          reordering: true,
        })),
      }));

      try {
        const res = await reorderWorkoutExercisesRequest({
          workoutId: action.workoutId,
          items: snapshot.map((item) => ({
            id: item.id,
            exerciseOrder: item.exerciseOrder,
          })),
        });

        const restoredItems = (res?.data || [])
          .map((item) => ({
            ...item,
            reordering: false,
          }))
          .sort((a, b) => a.exerciseOrder - b.exerciseOrder);

        setWorkoutExercises((prev) => ({
          ...prev,
          [action.workoutId]: restoredItems,
        }));

        toast?.success({
          title: "Acción deshecha",
          message: "El orden anterior fue restaurado correctamente.",
        });
      } catch (err) {
        console.error(
          "Undo restore error:",
          err?.message || err
        );

        toast?.error({
          title: "No se pudo deshacer",
          message:
            "No fue posible restaurar el orden anterior de la rutina.",
        });

        await loadWorkoutExercises(action.workoutId);
      } finally {
        setReorderingWorkout((prev) => ({
          ...prev,
          [action.workoutId]: false,
        }));
      }
    },
    [
      loadWorkoutExercises,
      removeUndoAction,
      reorderWorkoutExercisesRequest,
      toast,
      undoStack,
    ]
  );

  const pushUndoAction = useCallback(
    ({ type, workoutId, snapshot, title, message }) => {
      const actionId = buildUndoActionId(type, workoutId);

      const action = {
        id: actionId,
        type,
        workoutId,
        snapshot: cloneWorkoutItems(snapshot),
        createdAt: Date.now(),
        expiresAt: Date.now() + UNDO_DURATION,
      };

      setUndoStack((prev) => [action, ...prev].slice(0, 8));

      window.setTimeout(() => {
        removeUndoAction(actionId);
      }, UNDO_DURATION);

      toast?.warning({
        title,
        message,
        actionLabel: "Deshacer",
        duration: UNDO_DURATION,
        onAction: async () => {
          await restoreUndoAction(actionId);
        },
      });

      return actionId;
    },
    [
      removeUndoAction,
      restoreUndoAction,
      toast,
    ]
  );

  function updateWorkoutExerciseForm(workoutId, key, value) {
    setSelectedExercises((prev) => ({
      ...prev,
      [workoutId]: {
        ...prev[workoutId],
        [key]: value,
      },
    }));
  }

  async function addWorkoutExerciseRequest({ workoutId, payload }) {
    return apiFetch(`/workouts/${workoutId}/exercises`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async function updateWorkoutExerciseRequest({
    workoutId,
    itemId,
    payload,
  }) {
    return apiFetch(`/workouts/${workoutId}/exercises/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  async function removeWorkoutExerciseRequest({ workoutId, itemId }) {
    return apiFetch(`/workouts/${workoutId}/exercises/${itemId}`, {
      method: "DELETE",
    });
  }

  async function handleAddExercise(workoutId) {
    const form = selectedExercises[workoutId];

    if (!form || !form.exerciseId) {
      setWorkoutFeedback(
        workoutId,
        "error",
        "Debes seleccionar un ejercicio"
      );

      toast?.warning({
        title: "Selecciona un ejercicio",
        message: "Debes elegir un ejercicio antes de agregarlo.",
      });

      return;
    }

    const selectedExercise = exercises.find(
      (exercise) => exercise.id === form.exerciseId
    );

    const currentItems = workoutExercises[workoutId] || [];
    const nextOrder = Number(form.exerciseOrder || currentItems.length + 1);
    const tempItemId = `temp-workout-exercise-${Date.now()}`;

    const optimisticItem = {
      id: tempItemId,
      workoutId,
      exerciseId: form.exerciseId,
      exerciseOrder: nextOrder,
      sets: Number(form.sets || 4),
      reps: form.reps || "12",
      restSeconds: Number(form.restSeconds || 60),
      notes: form.notes || "",
      exercise: selectedExercise || {
        id: form.exerciseId,
        name: "Ejercicio seleccionado",
      },
      optimistic: true,
    };

    const previousItems = cloneWorkoutItems(currentItems);

    setAddingExercise((prev) => ({
      ...prev,
      [workoutId]: true,
    }));

    setWorkoutExercises((prev) => ({
      ...prev,
      [workoutId]: [...(prev[workoutId] || []), optimisticItem],
    }));

    setSelectedExercises((prev) => ({
      ...prev,
      [workoutId]: {
        exerciseId: "",
        exerciseOrder: currentItems.length + 2,
        sets: 4,
        reps: "12",
        restSeconds: 60,
        notes: "",
      },
    }));

    try {
      const res = await addWorkoutExerciseRequest({
        workoutId,
        payload: {
          exerciseId: form.exerciseId,
          exerciseOrder: nextOrder,
          sets: Number(form.sets || 4),
          reps: form.reps || "12",
          restSeconds: Number(form.restSeconds || 60),
          notes: form.notes || "",
        },
      });

      const createdItem = res?.data;

      if (createdItem?.id) {
        setWorkoutExercises((prev) => ({
          ...prev,
          [workoutId]: (prev[workoutId] || []).map((item) =>
            item.id === tempItemId
              ? {
                  ...createdItem,
                  optimistic: false,
                }
              : item
          ),
        }));
      } else {
        await loadWorkoutExercises(workoutId);
      }

      setWorkoutFeedback(
        workoutId,
        "success",
        "Ejercicio agregado correctamente"
      );

      toast?.success({
        title: "Ejercicio agregado",
        message: "El ejercicio fue agregado correctamente a la rutina.",
      });
    } catch (err) {
      const message = getAddExerciseErrorMessage(err);

      setWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: previousItems,
      }));

      setWorkoutFeedback(workoutId, "error", message);

      toast?.error({
        title: "No se pudo agregar",
        message,
      });
    } finally {
      setAddingExercise((prev) => ({
        ...prev,
        [workoutId]: false,
      }));
    }
  }

  async function handleUpdateExercise({ workoutId, itemId, payload }) {
    const previousItems = cloneWorkoutItems(workoutExercises[workoutId] || []);

    setUpdatingExercise((prev) => ({
      ...prev,
      [itemId]: true,
    }));

    setWorkoutExercises((prev) => ({
      ...prev,
      [workoutId]: (prev[workoutId] || []).map((item) =>
        item.id === itemId
          ? {
              ...item,
              exerciseOrder: payload.exerciseOrder,
              sets: payload.sets,
              reps: payload.reps,
              restSeconds: payload.restSeconds,
              notes: payload.notes,
              updating: true,
            }
          : item
      ),
    }));

    try {
      const res = await updateWorkoutExerciseRequest({
        workoutId,
        itemId,
        payload,
      });

      const updatedItem = res?.data;

      if (updatedItem?.id) {
        setWorkoutExercises((prev) => ({
          ...prev,
          [workoutId]: (prev[workoutId] || [])
            .map((item) =>
              item.id === itemId
                ? {
                    ...updatedItem,
                    updating: false,
                  }
                : item
            )
            .sort((a, b) => a.exerciseOrder - b.exerciseOrder),
        }));
      } else {
        await loadWorkoutExercises(workoutId);
      }

      setWorkoutFeedback(
        workoutId,
        "success",
        "Ejercicio actualizado correctamente"
      );

      toast?.success({
        title: "Ejercicio actualizado",
        message: "Los cambios fueron guardados correctamente.",
      });
    } catch (err) {
      const message = getUpdateExerciseErrorMessage(err);

      setWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: previousItems,
      }));

      setWorkoutFeedback(workoutId, "error", message);

      toast?.error({
        title: "No se pudo actualizar",
        message,
      });

      throw err;
    } finally {
      setUpdatingExercise((prev) => ({
        ...prev,
        [itemId]: false,
      }));
    }
  }

  async function handleReorderExercises({ workoutId, reorderedItems }) {
    if (reorderingWorkout[workoutId]) {
      return;
    }

    const previousItems = cloneWorkoutItems(workoutExercises[workoutId] || []);

    setReorderingWorkout((prev) => ({
      ...prev,
      [workoutId]: true,
    }));

    setWorkoutExercises((prev) => ({
      ...prev,
      [workoutId]: reorderedItems.map((item) => ({
        ...item,
        reordering: true,
      })),
    }));

    try {
      const res = await reorderWorkoutExercisesRequest({
        workoutId,
        items: reorderedItems.map((item) => ({
          id: item.id,
          exerciseOrder: item.exerciseOrder,
        })),
      });

      const updatedItems = (res?.data || [])
        .map((item) => ({
          ...item,
          reordering: false,
        }))
        .sort((a, b) => a.exerciseOrder - b.exerciseOrder);

      setWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: updatedItems,
      }));

      pushUndoAction({
        type: "reorder",
        workoutId,
        snapshot: previousItems,
        title: "Orden actualizado",
        message: "Puedes deshacer este reordenamiento.",
      });
    } catch (err) {
      const message = getReorderExerciseErrorMessage(err);

      setWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: previousItems,
      }));

      toast?.error({
        title: "No se pudo reorganizar",
        message,
      });
    } finally {
      setReorderingWorkout((prev) => ({
        ...prev,
        [workoutId]: false,
      }));
    }
  }

  async function handleMoveExercise({ workoutId, itemId, direction }) {
    if (reorderingWorkout[workoutId]) {
      return;
    }

    const currentItems = [...(workoutExercises[workoutId] || [])].sort(
      (a, b) => a.exerciseOrder - b.exerciseOrder
    );

    const currentIndex = currentItems.findIndex((item) => item.id === itemId);

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= currentItems.length) {
      return;
    }

    const reordered = [...currentItems];
    const [movedItem] = reordered.splice(currentIndex, 1);

    reordered.splice(targetIndex, 0, movedItem);

    const normalized = reordered.map((item, index) => ({
      ...item,
      exerciseOrder: index + 1,
    }));

    await handleReorderExercises({
      workoutId,
      reorderedItems: normalized,
    });
  }

  function requestRemoveExercise(workoutId, itemId) {
    setPendingRemoveExercise({
      workoutId,
      itemId,
    });
  }

  async function confirmRemoveExercise() {
    if (!pendingRemoveExercise) {
      return;
    }

    const { workoutId, itemId } = pendingRemoveExercise;
    const previousItems = cloneWorkoutItems(workoutExercises[workoutId] || []);

    setPendingRemoveExercise(null);

    setRemovingExercise((prev) => ({
      ...prev,
      [itemId]: true,
    }));

    setWorkoutExercises((prev) => ({
      ...prev,
      [workoutId]: (prev[workoutId] || []).filter(
        (item) => item.id !== itemId
      ),
    }));

   try {
  const res = await removeWorkoutExerciseRequest({
    workoutId,
    itemId,
  });

  const updatedItems = (res?.data || [])
    .map((item) => ({
      ...item,
      removing: false,
    }))
    .sort((a, b) => a.exerciseOrder - b.exerciseOrder);

  setWorkoutExercises((prev) => ({
    ...prev,
    [workoutId]: updatedItems,
  }));

  setWorkoutFeedback(
    workoutId,
    "success",
    "Ejercicio eliminado correctamente"
  );
      toast?.success({
        title: "Ejercicio eliminado",
        message: "El ejercicio fue eliminado correctamente de la rutina.",
      });
    } catch (err) {
      const message = getRemoveExerciseErrorMessage(err);

      setWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: previousItems,
      }));

      setWorkoutFeedback(workoutId, "error", message);

      toast?.error({
        title: "No se pudo eliminar",
        message,
      });
    } finally {
      setRemovingExercise((prev) => ({
        ...prev,
        [itemId]: false,
      }));
    }
  }

  return {
    selectedExercises,
    setSelectedExercises,
    workoutExercises,
    setWorkoutExercises,
    addingExercise,
    updatingExercise,
    removingExercise,
    reorderingWorkout,
    undoStack,
    exerciseFeedback,
    pendingRemoveExercise,
    setPendingRemoveExercise,
    setWorkoutFeedback,
    loadWorkoutExercises,
    updateWorkoutExerciseForm,
    handleAddExercise,
    handleUpdateExercise,
    handleReorderExercises,
    handleMoveExercise,
    requestRemoveExercise,
    confirmRemoveExercise,
    restoreUndoAction,
  };
}