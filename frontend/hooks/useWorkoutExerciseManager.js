"use client";

import { useCallback, useState } from "react";

import { apiFetch } from "../lib/api";

export default function useWorkoutExerciseManager({
  exercises = [],
  toast,
}) {
  const [selectedExercises, setSelectedExercises] = useState({});
  const [workoutExercises, setWorkoutExercises] = useState({});
  const [addingExercise, setAddingExercise] = useState({});
  const [updatingExercise, setUpdatingExercise] = useState({});
  const [removingExercise, setRemovingExercise] = useState({});
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

  function updateWorkoutExerciseForm(workoutId, key, value) {
    setSelectedExercises((prev) => ({
      ...prev,
      [workoutId]: {
        ...prev[workoutId],
        [key]: value,
      },
    }));
  }

  async function addWorkoutExerciseRequest({
    workoutId,
    payload,
  }) {
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

  async function removeWorkoutExerciseRequest({
    workoutId,
    itemId,
  }) {
    return apiFetch(`/workouts/${workoutId}/exercises/${itemId}`, {
      method: "DELETE",
    });
  }

  async function handleAddExercise(workoutId) {
    const form = selectedExercises[workoutId];

    if (!form || !form.exerciseId) {
      setWorkoutFeedback(workoutId, "error", "Debes seleccionar un ejercicio");

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

    const previousItems = currentItems;

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

      setWorkoutFeedback(workoutId, "success", "Ejercicio agregado correctamente");

      toast?.success({
        title: "Ejercicio agregado",
        message: "El ejercicio fue agregado correctamente a la rutina.",
      });
    } catch (err) {
      const message =
        err.message === "Este ejercicio ya fue agregado a la rutina"
          ? "Ese ejercicio ya existe dentro de la rutina"
          : err.message === "Ya existe un ejercicio con ese orden dentro de la rutina"
            ? "Ese numero de orden ya esta ocupado"
            : err.message || "No se pudo agregar el ejercicio";

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

  async function handleUpdateExercise({
    workoutId,
    itemId,
    payload,
  }) {
    const previousItems = workoutExercises[workoutId] || [];

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

      setWorkoutFeedback(workoutId, "success", "Ejercicio actualizado correctamente");

      toast?.success({
        title: "Ejercicio actualizado",
        message: "Los cambios fueron guardados correctamente.",
      });
    } catch (err) {
      const message =
        err.message === "Ya existe un ejercicio con ese orden dentro de la rutina"
          ? "Ese numero de orden ya esta ocupado"
          : err.message || "No se pudo actualizar el ejercicio";

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

  async function handleMoveExercise({
    workoutId,
    itemId,
    direction,
  }) {
    const currentItems = [...(workoutExercises[workoutId] || [])].sort(
      (a, b) => a.exerciseOrder - b.exerciseOrder
    );

    const currentIndex = currentItems.findIndex((item) => item.id === itemId);

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= currentItems.length) {
      return;
    }

    const sourceItem = currentItems[currentIndex];
    const targetItem = currentItems[targetIndex];
    const previousItems = [...currentItems];

    const reordered = currentItems
      .map((item) => {
        if (item.id === sourceItem.id) {
          return {
            ...item,
            exerciseOrder: targetItem.exerciseOrder,
            updating: true,
          };
        }

        if (item.id === targetItem.id) {
          return {
            ...item,
            exerciseOrder: sourceItem.exerciseOrder,
            updating: true,
          };
        }

        return item;
      })
      .sort((a, b) => a.exerciseOrder - b.exerciseOrder);

    setWorkoutExercises((prev) => ({
      ...prev,
      [workoutId]: reordered,
    }));

    setUpdatingExercise((prev) => ({
      ...prev,
      [sourceItem.id]: true,
      [targetItem.id]: true,
    }));

    try {
      await updateWorkoutExerciseRequest({
        workoutId,
        itemId: sourceItem.id,
        payload: {
          exerciseOrder: targetItem.exerciseOrder,
          sets: sourceItem.sets,
          reps: sourceItem.reps,
          restSeconds: sourceItem.restSeconds || 0,
          notes: sourceItem.notes || "",
        },
      });

      await updateWorkoutExerciseRequest({
        workoutId,
        itemId: targetItem.id,
        payload: {
          exerciseOrder: sourceItem.exerciseOrder,
          sets: targetItem.sets,
          reps: targetItem.reps,
          restSeconds: targetItem.restSeconds || 0,
          notes: targetItem.notes || "",
        },
      });

      await loadWorkoutExercises(workoutId);

      toast?.success({
        title: "Orden actualizado",
        message: "La posicion del ejercicio fue actualizada.",
      });
    } catch (err) {
      setWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: previousItems,
      }));

      toast?.error({
        title: "No se pudo mover",
        message: err.message || "No fue posible actualizar el orden.",
      });
    } finally {
      setUpdatingExercise((prev) => ({
        ...prev,
        [sourceItem.id]: false,
        [targetItem.id]: false,
      }));
    }
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
    const previousItems = workoutExercises[workoutId] || [];

    setPendingRemoveExercise(null);

    setRemovingExercise((prev) => ({
      ...prev,
      [itemId]: true,
    }));

    setWorkoutExercises((prev) => ({
      ...prev,
      [workoutId]: (prev[workoutId] || []).filter((item) => item.id !== itemId),
    }));

    try {
      await removeWorkoutExerciseRequest({
        workoutId,
        itemId,
      });

      setWorkoutFeedback(workoutId, "success", "Ejercicio eliminado correctamente");

      toast?.success({
        title: "Ejercicio eliminado",
        message: "El ejercicio fue eliminado correctamente de la rutina.",
      });
    } catch (err) {
      const message =
        err.message || "No se pudo eliminar el ejercicio de la rutina";

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
    exerciseFeedback,
    pendingRemoveExercise,
    setPendingRemoveExercise,
    setWorkoutFeedback,
    loadWorkoutExercises,
    updateWorkoutExerciseForm,
    handleAddExercise,
    handleUpdateExercise,
    handleMoveExercise,
    requestRemoveExercise,
    confirmRemoveExercise,
  };
}
