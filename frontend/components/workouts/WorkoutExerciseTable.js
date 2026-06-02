"use client";

import {
  useCallback,
  useMemo,
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

import { theme } from "../../lib/theme";

export default function WorkoutExerciseTable({
  workoutId,
  assignedExercises = [],
  removingExercise = {},
  updatingExercise = {},
  reordering = false,
  undoStack = [],
  onUndo,
  pendingReorderActions = {},
  onConfirmReorder,
  onRequestRemove,
  onUpdateExercise,
  onReorderExercises,
}) {
  const [editingItemId, setEditingItemId] =
    useState(null);

  const editingLocked =
    Boolean(editingItemId);

  const interactionLocked =
    reordering || editingLocked;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const sortableItems = useMemo(() => {
    return assignedExercises.map(
      (item) => item.id
    );
  }, [assignedExercises]);

  const latestUndo = useMemo(() => {
  return undoStack.find(
    (item) =>
      item.type === "reorder" &&
      String(item.workoutId) === String(workoutId)
  );
}, [undoStack, workoutId]);

  const hasPendingReorder =
  Boolean(
    pendingReorderActions[workoutId]
  );

  const handleEditingChange =
    useCallback((itemId) => {
      setEditingItemId(itemId || null);
    }, []);

  const handleUndo = useCallback(async () => {
    if (!latestUndo) {
      return;
    }

    await onUndo?.(latestUndo.id);
  }, [latestUndo, onUndo]);

  const handleConfirmReorder =
  useCallback(() => {
    onConfirmReorder?.(workoutId);
  }, [
    onConfirmReorder,
    workoutId,
  ]);

  const handleDragEnd = useCallback(
    async (event) => {
      if (interactionLocked) {
        return;
      }

      const { active, over } = event;

      if (!active?.id || !over?.id) {
        return;
      }

      if (active.id === over.id) {
        return;
      }

      const reordered =
        reorderWorkoutExercises({
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
      interactionLocked,
      onReorderExercises,
      workoutId,
    ]
  );

  const handleRemove = useCallback(
    (itemId) => {
      if (interactionLocked) {
        return;
      }

      onRequestRemove(
        workoutId,
        itemId
      );
    },
    [
      interactionLocked,
      onRequestRemove,
      workoutId,
    ]
  );

  const renderRow = useCallback(
    (row) => {
      const isCurrentRowEditing =
        editingItemId === row.id;

      return (
        <SortableWorkoutExerciseRow
          key={row.id}
          id={row.id}
          disabled={interactionLocked}
        >
          <WorkoutExerciseCard
            workoutId={workoutId}
            row={row}
            isUpdating={
              updatingExercise[row.id] ||
              row.reordering
            }
            removing={
              removingExercise[row.id]
            }
            reorderLocked={reordering}
            editingLocked={
              editingLocked
            }
            isCurrentRowEditing={
              isCurrentRowEditing
            }
            onEditingChange={
              handleEditingChange
            }
            onUpdateExercise={
              onUpdateExercise
            }
            onRemove={handleRemove}
          />
        </SortableWorkoutExerciseRow>
      );
    },
    [
      editingItemId,
      editingLocked,
      handleEditingChange,
      handleRemove,
      interactionLocked,
      onUpdateExercise,
      removingExercise,
      reordering,
      updatingExercise,
      workoutId,
    ]
  );

  return (
    <ContentStack gap={14}>
      <InlineGroup justify="space-between">
        <h4 style={styles.subTitle}>
          Ejercicios asignados
        </h4>

        <InlineGroup gap={10}>
          {reordering ? (
            <Badge variant="warning">
              Sincronizando orden...
            </Badge>
          ) : null}

          {editingLocked ? (
            <Badge variant="warning">
              Edición activa
            </Badge>
          ) : null}

          <Badge variant="default">
            {assignedExercises.length} items
          </Badge>
        </InlineGroup>
      </InlineGroup>

      {latestUndo ? (
        <div style={styles.undoBanner}>
          <div>
            <strong style={styles.undoTitle}>
              Cambio reciente
            </strong>

            <p style={styles.undoText}>
              Puedes deshacer el último reordenamiento.
            </p>
          </div>

          <InlineGroup gap={10}>
            <button
              type="button"
              onClick={handleUndo}
              style={styles.undoButton}
            >
              Deshacer
            </button>

            {hasPendingReorder ? (
              <button
                type="button"
                onClick={handleConfirmReorder}
                style={styles.confirmButton}
              >
                Confirmar
              </button>
            ) : null}
          </InlineGroup>
        </div>
      ) : null}

      {assignedExercises.length === 0 ? (
        <EmptyState>
          Esta rutina todavia no tiene ejercicios.
        </EmptyState>
      ) : (
        <div
          style={{
            opacity:
              interactionLocked
                ? 0.78
                : 1,

            transition:
              "opacity 0.18s ease",
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={
              closestCenter
            }
            onDragEnd={
              handleDragEnd
            }
          >
            <SortableContext
              items={sortableItems}
              strategy={
                verticalListSortingStrategy
              }
            >
              <ContentStack gap={14}>
                {assignedExercises.map(
                  renderRow
                )}
              </ContentStack>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </ContentStack>
  );
}

const styles = {
  undoBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "14px 16px",
    borderRadius: 16,
    border:
      "1px solid rgba(245, 158, 11, 0.24)",
    background:
      "rgba(245, 158, 11, 0.08)",
  },

  undoTitle: {
    display: "block",
    marginBottom: 4,
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: "900",
  },

  undoText: {
    margin: 0,
    color: "rgba(248,250,252,0.72)",
    fontSize: 13,
  },

  undoButton: {
    border: "none",
    cursor: "pointer",
    borderRadius: 999,
    padding: "10px 14px",
    background:
      "rgba(245, 158, 11, 0.18)",
    color: "#fbbf24",
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
  },

  confirmButton: {
    border: "none",
    cursor: "pointer",
    borderRadius: 999,
    padding: "10px 14px",
    background:
      "rgba(34, 197, 94, 0.18)",
    color: "#22c55e",
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
  },

  subTitle: {
    margin: 0,
    color:
      theme.colors.textPrimary,
    fontSize: "16px",
    fontWeight: "900",
  },
};