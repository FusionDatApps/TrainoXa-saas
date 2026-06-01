"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Badge from "../ui/Badge";
import ContentStack from "../ui/ContentStack";
import EmptyState from "../ui/EmptyState";
import InlineGroup from "../ui/InlineGroup";

import SortableWorkoutExerciseRow from "./SortableWorkoutExerciseRow";
import WorkoutExerciseCard from "./WorkoutExerciseCard";

import {
  reorderWorkoutExercises,
} from "../../lib/workout-sort";

import useDebouncedWorkoutSave from "../../hooks/useDebouncedWorkoutSave";

import { theme } from "../../lib/theme";

export default function WorkoutExerciseTable({
  workoutId,
  assignedExercises = [],
  removingExercise = {},
  updatingExercise = {},
  onRequestRemove,
  onUpdateExercise,
  onReorderExercises,
}) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [draft, setDraft] = useState({});
  const [autosaveState, setAutosaveState] = useState("idle");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const { triggerSave } = useDebouncedWorkoutSave({
    delay: 700,
    onSave: async ({ row, payload }) => {
      setAutosaveState("saving");

      try {
        await onUpdateExercise?.({
          workoutId,
          itemId: row.id,
          payload,
        });

        setAutosaveState("saved");

        setTimeout(() => {
          setAutosaveState("idle");
        }, 1200);
      } catch (error) {
        console.error(
          "Autosave failed:",
          error?.message || error
        );

        setAutosaveState("error");
      }
    },
  });

  useEffect(() => {
    if (autosaveState !== "error") {
      return;
    }

    const timeout = setTimeout(() => {
      setAutosaveState("idle");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [autosaveState]);

  const startEditing = useCallback((row) => {
    setEditingItemId(row.id);

    setDraft({
      exerciseOrder: row.exerciseOrder || 1,
      sets: row.sets || 4,
      reps: row.reps || "12",
      restSeconds: row.restSeconds || 60,
      notes: row.notes || "",
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingItemId(null);
    setDraft({});
    setAutosaveState("idle");
  }, []);

  const updateDraft = useCallback(
    (row, key, value) => {
      const nextDraft = {
        ...draft,
        [key]: value,
      };

      setDraft(nextDraft);

      triggerSave({
        row,
        payload: {
          exerciseOrder: Number(
            nextDraft.exerciseOrder ||
              row.exerciseOrder ||
              1
          ),
          sets: Number(
            nextDraft.sets ||
              row.sets ||
              4
          ),
          reps:
            nextDraft.reps ||
            row.reps ||
            "12",
          restSeconds: Number(
            nextDraft.restSeconds ||
              row.restSeconds ||
              60
          ),
          notes: nextDraft.notes || "",
        },
      });
    },
    [draft, triggerSave]
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;

      if (!active?.id || !over?.id) {
        return;
      }

      if (active.id === over.id) {
        return;
      }

      const reordered = reorderWorkoutExercises({
        items: assignedExercises,
        activeId: active.id,
        overId: over.id,
      });

      await onReorderExercises?.({
        workoutId,
        reorderedItems: reordered,
      });
    },
    [
      assignedExercises,
      onReorderExercises,
      workoutId,
    ]
  );

  const renderNumberInput = useCallback(
    (row, key, fallback) => {
      return (
        <input
          type="number"
          value={draft[key] ?? fallback}
          onChange={(e) =>
            updateDraft(
              row,
              key,
              e.target.value
            )
          }
          style={styles.input}
        />
      );
    },
    [draft, updateDraft]
  );

  const renderTextInput = useCallback(
    (row, key, fallback) => {
      return (
        <input
          type="text"
          value={draft[key] ?? fallback}
          onChange={(e) =>
            updateDraft(
              row,
              key,
              e.target.value
            )
          }
          style={styles.input}
        />
      );
    },
    [draft, updateDraft]
  );

  const handleRemove = useCallback(
    (itemId) => {
      onRequestRemove(workoutId, itemId);
    },
    [onRequestRemove, workoutId]
  );

  const renderRow = useCallback(
    (row) => {
      const isEditing = editingItemId === row.id;
      const isUpdating = updatingExercise[row.id];

      return (
        <SortableWorkoutExerciseRow
          key={row.id}
          id={row.id}
        >
          <WorkoutExerciseCard
            row={row}
            isEditing={isEditing}
            isUpdating={isUpdating}
            removing={removingExercise[row.id]}
            autosaveState={autosaveState}
            renderNumberInput={renderNumberInput}
            renderTextInput={renderTextInput}
            onStartEditing={startEditing}
            onCancelEditing={cancelEditing}
            onRemove={handleRemove}
          />
        </SortableWorkoutExerciseRow>
      );
    },
    [
      autosaveState,
      cancelEditing,
      editingItemId,
      handleRemove,
      removingExercise,
      renderNumberInput,
      renderTextInput,
      startEditing,
      updatingExercise,
    ]
  );

  return (
    <ContentStack gap={14}>
      <InlineGroup justify="space-between">
        <h4 style={styles.subTitle}>
          Ejercicios asignados
        </h4>

        <Badge variant="default">
          {assignedExercises.length} items
        </Badge>
      </InlineGroup>

      {assignedExercises.length === 0 ? (
        <EmptyState>
          Esta rutina todavia no tiene ejercicios.
        </EmptyState>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={assignedExercises.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <ContentStack gap={14}>
              {assignedExercises.map(renderRow)}
            </ContentStack>
          </SortableContext>
        </DndContext>
      )}
    </ContentStack>
  );
}

const styles = {
  subTitle: {
    margin: 0,
    color: theme.colors.textPrimary,
    fontSize: "16px",
    fontWeight: "900",
  },

  input: {
    width: "100%",
    minWidth: 72,
    padding: "10px 12px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontSize: "14px",
    fontWeight: "700",
  },
};