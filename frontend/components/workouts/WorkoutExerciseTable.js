"use client";

import { useState } from "react";

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

import ActionButton from "../ui/ActionButton";
import Badge from "../ui/Badge";
import ContentStack from "../ui/ContentStack";
import EmptyState from "../ui/EmptyState";
import InlineGroup from "../ui/InlineGroup";

import WorkoutExerciseRowEditor from "./WorkoutExerciseRowEditor";
import SortableWorkoutExerciseRow from "./SortableWorkoutExerciseRow";

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
  const [editingItemId, setEditingItemId] = useState(null);
  const [draft, setDraft] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  function startEditing(row) {
    setEditingItemId(row.id);

    setDraft({
      exerciseOrder: row.exerciseOrder || 1,
      sets: row.sets || 4,
      reps: row.reps || "12",
      restSeconds: row.restSeconds || 60,
      notes: row.notes || "",
    });
  }

  function cancelEditing() {
    setEditingItemId(null);
    setDraft({});
  }

  function updateDraft(key, value) {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function saveEditing(row) {
    if (!onUpdateExercise) {
      cancelEditing();
      return;
    }

    await onUpdateExercise({
      workoutId,
      itemId: row.id,
      payload: {
        exerciseOrder: Number(
          draft.exerciseOrder || row.exerciseOrder || 1
        ),
        sets: Number(draft.sets || row.sets || 4),
        reps: draft.reps || row.reps || "12",
        restSeconds: Number(
          draft.restSeconds || row.restSeconds || 60
        ),
        notes: draft.notes || "",
      },
    });

    cancelEditing();
  }

  async function handleDragEnd(event) {
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
  }

  function renderNumberInput(key, fallback) {
    return (
      <input
        type="number"
        value={draft[key] ?? fallback}
        onChange={(e) => updateDraft(key, e.target.value)}
        style={styles.input}
      />
    );
  }

  function renderTextInput(key, fallback) {
    return (
      <input
        type="text"
        value={draft[key] ?? fallback}
        onChange={(e) => updateDraft(key, e.target.value)}
        style={styles.input}
      />
    );
  }

  function renderRow(row) {
    const isEditing = editingItemId === row.id;
    const isUpdating = updatingExercise[row.id];

    return (
      <SortableWorkoutExerciseRow key={row.id} id={row.id}>
        <div style={styles.card}>
          <div style={styles.topRow}>
            <InlineGroup gap={10}>
              <Badge variant="default">
                #{row.exerciseOrder}
              </Badge>

              <WorkoutExerciseRowEditor
                item={row}
                editing={isEditing}
              />
            </InlineGroup>

            <InlineGroup gap={8}>
              <ActionButton
                variant="secondary"
                disabled={row.optimistic}
                onClick={() => startEditing(row)}
              >
                Editar
              </ActionButton>

              <ActionButton
                variant="danger"
                disabled={removingExercise[row.id] || row.optimistic}
                onClick={() => onRequestRemove(workoutId, row.id)}
              >
                {removingExercise[row.id]
                  ? "Eliminando..."
                  : "Eliminar"}
              </ActionButton>
            </InlineGroup>
          </div>

          <div style={styles.metrics}>
            <div style={styles.metricBox}>
              <span style={styles.metricLabel}>Sets</span>

              {isEditing ? (
                renderNumberInput("sets", row.sets)
              ) : (
                <span style={styles.metricValue}>{row.sets}</span>
              )}
            </div>

            <div style={styles.metricBox}>
              <span style={styles.metricLabel}>Reps</span>

              {isEditing ? (
                renderTextInput("reps", row.reps)
              ) : (
                <span style={styles.metricValue}>{row.reps}</span>
              )}
            </div>

            <div style={styles.metricBox}>
              <span style={styles.metricLabel}>Descanso</span>

              {isEditing ? (
                renderNumberInput(
                  "restSeconds",
                  row.restSeconds || 0
                )
              ) : (
                <span style={styles.metricValue}>
                  {row.restSeconds || 0}s
                </span>
              )}
            </div>
          </div>

          <div style={styles.notesBox}>
            <span style={styles.metricLabel}>Notas</span>

            {isEditing ? (
              renderTextInput("notes", row.notes || "")
            ) : (
              <p style={styles.notes}>{row.notes || "Sin notas"}</p>
            )}
          </div>

          {isEditing ? (
            <InlineGroup gap={8}>
              <ActionButton
                disabled={isUpdating}
                onClick={() => saveEditing(row)}
              >
                {isUpdating ? "Guardando..." : "Guardar"}
              </ActionButton>

              <ActionButton
                variant="secondary"
                disabled={isUpdating}
                onClick={cancelEditing}
              >
                Cancelar
              </ActionButton>
            </InlineGroup>
          ) : null}
        </div>
      </SortableWorkoutExerciseRow>
    );
  }

  return (
    <ContentStack gap={14}>
      <InlineGroup justify="space-between">
        <h4 style={styles.subTitle}>Ejercicios asignados</h4>

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

  card: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    background: "rgba(15, 23, 42, 0.72)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
  },

  metricBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  metricLabel: {
    color: theme.colors.textMuted,
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  metricValue: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
    fontSize: "14px",
  },

  notesBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  notes: {
    margin: 0,
    color: theme.colors.textSecondary,
    fontSize: "14px",
    lineHeight: 1.5,
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