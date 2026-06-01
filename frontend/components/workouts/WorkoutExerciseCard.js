"use client";

import { memo } from "react";

import ActionButton from "../ui/ActionButton";
import Badge from "../ui/Badge";
import InlineGroup from "../ui/InlineGroup";

import WorkoutExerciseRowEditor from "./WorkoutExerciseRowEditor";

import { theme } from "../../lib/theme";

function WorkoutExerciseCard({
  row,
  isEditing,
  isUpdating,
  removing,
  autosaveState,
  renderNumberInput,
  renderTextInput,
  onStartEditing,
  onCancelEditing,
  onRemove,
}) {
  function renderAutosaveState() {
    if (
      autosaveState ===
      "saving"
    ) {
      return (
        <span
          style={
            styles.autosaveSaving
          }
        >
          Guardando...
        </span>
      );
    }

    if (
      autosaveState ===
      "saved"
    ) {
      return (
        <span
          style={
            styles.autosaveSaved
          }
        >
          Guardado
        </span>
      );
    }

    if (
      autosaveState ===
      "error"
    ) {
      return (
        <span
          style={
            styles.autosaveError
          }
        >
          Error guardando
        </span>
      );
    }

    return null;
  }

  return (
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
          {isEditing
            ? renderAutosaveState()
            : null}

          <ActionButton
            variant="secondary"
            disabled={
              row.optimistic
            }
            onClick={() =>
              onStartEditing(row)
            }
          >
            Editar
          </ActionButton>

          <ActionButton
            variant="danger"
            disabled={
              removing ||
              row.optimistic
            }
            onClick={() =>
              onRemove(row.id)
            }
          >
            {removing
              ? "Eliminando..."
              : "Eliminar"}
          </ActionButton>
        </InlineGroup>
      </div>

      <div style={styles.metrics}>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>
            Sets
          </span>

          {isEditing ? (
            renderNumberInput(
              row,
              "sets",
              row.sets
            )
          ) : (
            <span
              style={
                styles.metricValue
              }
            >
              {row.sets}
            </span>
          )}
        </div>

        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>
            Reps
          </span>

          {isEditing ? (
            renderTextInput(
              row,
              "reps",
              row.reps
            )
          ) : (
            <span
              style={
                styles.metricValue
              }
            >
              {row.reps}
            </span>
          )}
        </div>

        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>
            Descanso
          </span>

          {isEditing ? (
            renderNumberInput(
              row,
              "restSeconds",
              row.restSeconds ||
                0
            )
          ) : (
            <span
              style={
                styles.metricValue
              }
            >
              {row.restSeconds}s
            </span>
          )}
        </div>
      </div>

      <div style={styles.notesBox}>
        <span style={styles.metricLabel}>
          Notas
        </span>

        {isEditing ? (
          renderTextInput(
            row,
            "notes",
            row.notes || ""
          )
        ) : (
          <p style={styles.notes}>
            {row.notes ||
              "Sin notas"}
          </p>
        )}
      </div>

      {isEditing ? (
        <InlineGroup gap={8}>
          <ActionButton
            variant="secondary"
            disabled={
              isUpdating
            }
            onClick={
              onCancelEditing
            }
          >
            Cerrar
          </ActionButton>
        </InlineGroup>
      ) : null}
    </div>
  );
}

export default memo(
  WorkoutExerciseCard
);

const styles = {
  card: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius:
      theme.radius.md,
    background:
      "rgba(15, 23, 42, 0.72)",
    padding: "16px",
    display: "flex",
    flexDirection:
      "column",
    gap: "16px",
  },

  topRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  metrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
  },

  metricBox: {
    display: "flex",
    flexDirection:
      "column",
    gap: "8px",
  },

  metricLabel: {
    color:
      theme.colors
        .textMuted,
    fontSize: "12px",
    fontWeight: "900",
    textTransform:
      "uppercase",
    letterSpacing:
      "0.04em",
  },

  metricValue: {
    color:
      theme.colors
        .textPrimary,
    fontWeight: "800",
    fontSize: "14px",
  },

  notesBox: {
    display: "flex",
    flexDirection:
      "column",
    gap: "8px",
  },

  notes: {
    margin: 0,
    color:
      theme.colors
        .textSecondary,
    fontSize: "14px",
    lineHeight: 1.5,
  },

  autosaveSaving: {
    color: "#f59e0b",
    fontSize: "12px",
    fontWeight: "800",
  },

  autosaveSaved: {
    color: "#22c55e",
    fontSize: "12px",
    fontWeight: "800",
  },

  autosaveError: {
    color: "#ef4444",
    fontSize: "12px",
    fontWeight: "800",
  },
}; 
