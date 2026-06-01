"use client";

import {
  useCallback,
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
  onRequestRemove,
  onUpdateExercise,
  onReorderExercises,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
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

  const handleRemove = useCallback(
    (itemId) => {
      onRequestRemove(workoutId, itemId);
    },
    [onRequestRemove, workoutId]
  );

  const renderRow = useCallback(
    (row) => {
      return (
        <SortableWorkoutExerciseRow
          key={row.id}
          id={row.id}
        >
          <WorkoutExerciseCard
            workoutId={workoutId}
            row={row}
            isUpdating={updatingExercise[row.id]}
            removing={removingExercise[row.id]}
            onUpdateExercise={onUpdateExercise}
            onRemove={handleRemove}
          />
        </SortableWorkoutExerciseRow>
      );
    },
    [
      handleRemove,
      onUpdateExercise,
      removingExercise,
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
};