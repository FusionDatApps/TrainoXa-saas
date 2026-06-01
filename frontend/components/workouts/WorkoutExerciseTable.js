"use client";

import { useState } from "react";

import ActionButton from "../ui/ActionButton";
import Badge from "../ui/Badge";
import ContentStack from "../ui/ContentStack";
import DataTable from "../ui/DataTable";
import EmptyState from "../ui/EmptyState";
import InlineGroup from "../ui/InlineGroup";

import WorkoutExerciseRowEditor from "./WorkoutExerciseRowEditor";

import { theme } from "../../lib/theme";

export default function WorkoutExerciseTable({
  workoutId,
  assignedExercises = [],
  removingExercise = {},
  updatingExercise = {},
  onRequestRemove,
  onUpdateExercise,
  onMoveExercise,
}) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [draft, setDraft] = useState({});

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
        exerciseOrder: Number(draft.exerciseOrder || row.exerciseOrder || 1),
        sets: Number(draft.sets || row.sets || 4),
        reps: draft.reps || row.reps || "12",
        restSeconds: Number(draft.restSeconds || row.restSeconds || 60),
        notes: draft.notes || "",
      },
    });

    cancelEditing();
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

  function buildColumns() {
    return [
      {
        key: "move",
        label: "",
        render: (row, index) => (
          <InlineGroup gap={6}>
            <button
              type="button"
              style={styles.moveButton}
              disabled={
                updatingExercise[row.id] ||
                index === 0
              }
              onClick={() =>
                onMoveExercise?.({
                  workoutId,
                  itemId: row.id,
                  direction: "up",
                })
              }
            >
              ↑
            </button>

            <button
              type="button"
              style={styles.moveButton}
              disabled={
                updatingExercise[row.id] ||
                index === assignedExercises.length - 1
              }
              onClick={() =>
                onMoveExercise?.({
                  workoutId,
                  itemId: row.id,
                  direction: "down",
                })
              }
            >
              ↓
            </button>
          </InlineGroup>
        ),
      },

      {
        key: "order",
        label: "#",
        render: (row) => row.exerciseOrder,
      },

      {
        key: "exercise",
        label: "Ejercicio",
        render: (row) => (
          <WorkoutExerciseRowEditor
            item={row}
            editing={editingItemId === row.id}
          />
        ),
      },

      {
        key: "sets",
        label: "Sets",
        render: (row) =>
          editingItemId === row.id
            ? renderNumberInput("sets", row.sets)
            : row.sets,
      },

      {
        key: "reps",
        label: "Reps",
        render: (row) =>
          editingItemId === row.id
            ? renderTextInput("reps", row.reps)
            : row.reps,
      },

      {
        key: "rest",
        label: "Descanso",
        render: (row) =>
          editingItemId === row.id
            ? renderNumberInput("restSeconds", row.restSeconds || 0)
            : `${row.restSeconds || 0}s`,
      },

      {
        key: "notes",
        label: "Notas",
        render: (row) =>
          editingItemId === row.id
            ? renderTextInput("notes", row.notes || "")
            : row.notes || "Sin notas",
      },

      {
        key: "actions",
        label: "Acciones",
        render: (row) => {
          const isEditing = editingItemId === row.id;
          const isUpdating = updatingExercise[row.id];

          if (isEditing) {
            return (
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
            );
          }

          return (
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
          );
        },
      },
    ];
  }

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
        <DataTable
          columns={buildColumns()}
          data={assignedExercises}
          emptyMessage="No hay ejercicios asignados"
        />
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

  moveButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    color: theme.colors.textPrimary,
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "14px",
  },
};