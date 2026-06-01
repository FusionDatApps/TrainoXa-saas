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

  const handleEditingChange =
    useCallback((itemId) => {
      setEditingItemId(itemId || null);
    }, []);

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
  subTitle: {
    margin: 0,
    color:
      theme.colors.textPrimary,
    fontSize: "16px",
    fontWeight: "900",
  },
};