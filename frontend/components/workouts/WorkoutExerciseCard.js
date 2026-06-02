"use client";

import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import ActionButton from "../ui/ActionButton";
import Badge from "../ui/Badge";
import AsyncStatusBadge from "../ui/AsyncStatusBadge";
import InlineGroup from "../ui/InlineGroup";

import WorkoutExerciseRowEditor from "./WorkoutExerciseRowEditor";

import useDebouncedWorkoutSave from "../../hooks/useDebouncedWorkoutSave";
import useWorkoutAutosaveStatus from "../../hooks/useWorkoutAutosaveStatus";

import { theme } from "../../lib/theme";

function WorkoutExerciseCard({
  workoutId,
  row,
  isUpdating,
  removing,
  reorderLocked = false,
  editingLocked = false,
  isCurrentRowEditing = false,
  onEditingChange,
  onUpdateExercise,
  onRemove,
}) {
  const [isEditing, setIsEditing] =
    useState(false);

  const [draft, setDraft] =
    useState({});

  const lastPayloadRef =
    useRef("");

  const {
    autosaveState,
    markSaving,
    markSaved,
    markError,
  } = useWorkoutAutosaveStatus();

  const basePayload = useMemo(() => {
    return {
      exerciseOrder:
        row.exerciseOrder || 1,

      sets:
        row.sets || 4,

      reps:
        row.reps || "12",

      restSeconds:
        row.restSeconds || 60,

      notes:
        row.notes || "",
    };
  }, [
    row.exerciseOrder,
    row.notes,
    row.reps,
    row.restSeconds,
    row.sets,
  ]);

  const {
    triggerSave,
    cancelSave,
  } = useDebouncedWorkoutSave({
    delay: 700,

    onSave: async (payload) => {
      markSaving();

      try {
        await onUpdateExercise?.({
          workoutId,
          itemId: row.id,
          payload,
        });

        markSaved();
      } catch (error) {
        console.error(
          "Autosave failed:",
          error?.message || error
        );

        markError();
      }
    },
  });

  const buildPayload =
    useCallback(
      (nextDraft) => {
        return {
          exerciseOrder: Number(
            nextDraft.exerciseOrder ??
              basePayload.exerciseOrder
          ),

          sets: Number(
            nextDraft.sets ??
              basePayload.sets
          ),

          reps:
            nextDraft.reps ??
            basePayload.reps,

          restSeconds: Number(
            nextDraft.restSeconds ??
              basePayload.restSeconds
          ),

          notes:
            nextDraft.notes ??
            basePayload.notes,
        };
      },
      [basePayload]
    );

  const interactionState = useMemo(() => {
    const anotherRowEditing =
      editingLocked && !isCurrentRowEditing;

    const lockedByReorder =
      reorderLocked || row.reordering;

    
    return {
      anotherRowEditing,
      lockedByReorder,
      
      canStartEditing:
        !lockedByReorder &&
        !anotherRowEditing &&
        !row.optimistic,

      canRemove:
        !lockedByReorder &&
        !editingLocked &&
        !row.optimistic &&
        !removing,

      canEditDraft:
        !lockedByReorder &&
        isCurrentRowEditing,
    };
  }, [
    editingLocked,
    isCurrentRowEditing,
    removing,
    reorderLocked,
    row.optimistic,
    row.reordering,
  ]);
    

  function startEditing() {
    if (!interactionState.canStartEditing) {
      return;
    }

    setIsEditing(true);
    onEditingChange?.(row.id);

    setDraft(basePayload);

    lastPayloadRef.current =
      JSON.stringify(basePayload);
  }

  function cancelEditing() {
    cancelSave();

    setIsEditing(false);
    onEditingChange?.(null);

    setDraft({});
  }

  function updateDraft(
    key,
    value
  ) {
    if (!interactionState.canEditDraft) {
      return;
    }

    const nextDraft = {
      ...draft,
      [key]: value,
    };

    setDraft(nextDraft);

    const payload =
      buildPayload(nextDraft);

    const serializedPayload =
      JSON.stringify(payload);

    if (
      serializedPayload ===
      lastPayloadRef.current
    ) {
      return;
    }

    lastPayloadRef.current =
      serializedPayload;

    triggerSave(payload);
  }

  function renderAutosaveState() {
    if (
      autosaveState === "saving" ||
      isUpdating
    ) {
      return (
        <AsyncStatusBadge
          status="saving"
        />
      );
    }

    if (
      autosaveState === "saved"
    ) {
      return (
        <AsyncStatusBadge
          status="saved"
        />
      );
    }

    if (
      autosaveState === "error"
    ) {
      return (
        <AsyncStatusBadge
          status="error"
          label="Error guardando"
        />
      );
    }

    return null;
  }
  
  function renderNumberInput(
    key,
    fallback
  ) {
    return (
      <input
        type="number"
        disabled={!interactionState.canEditDraft}
        value={
          draft[key] ?? fallback
        }
        onChange={(e) =>
          updateDraft(
            key,
            e.target.value
          )
        }
        style={styles.input}
      />
    );
  }

  function renderTextInput(
    key,
    fallback
  ) {
    return (
      <input
        type="text"
        disabled={!interactionState.canEditDraft}
        value={
          draft[key] ?? fallback
        }
        onChange={(e) =>
          updateDraft(
            key,
            e.target.value
          )
        }
        style={styles.input}
      />
    );
  }

  const disableEdit =
    !interactionState.canStartEditing;

  const disableRemove =
    !interactionState.canRemove;

  return (
    <div
      style={{
        ...styles.card,

        opacity:
          row.reordering
            ? 0.72
            : 1,
      }}
    >
      <div style={styles.topRow}>
        <InlineGroup gap={10}>
          <Badge variant="default">
            #{row.exerciseOrder}
          </Badge>

          {row.reordering ? (
            <Badge variant="warning">
              Sync...
            </Badge>
          ) : null}

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
            disabled={disableEdit}
            onClick={
              startEditing
            }
          >
            Editar
          </ActionButton>

          <ActionButton
            variant="danger"
            disabled={disableRemove}
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
          <span
            style={
              styles.metricLabel
            }
          >
            Sets
          </span>

          {isEditing ? (
            renderNumberInput(
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
          <span
            style={
              styles.metricLabel
            }
          >
            Reps
          </span>

          {isEditing ? (
            renderTextInput(
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
          <span
            style={
              styles.metricLabel
            }
          >
            Descanso
          </span>

          {isEditing ? (
            renderNumberInput(
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
              {
                row.restSeconds
              }
              s
            </span>
          )}
        </div>
      </div>

      <div style={styles.notesBox}>
        <span
          style={
            styles.metricLabel
          }
        >
          Notas
        </span>

        {isEditing ? (
          renderTextInput(
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
              interactionState.lockedByReorder
            }
            onClick={
              cancelEditing
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
    flexDirection: "column",
    gap: "16px",
    transition:
      "opacity 0.18s ease",
  },

  topRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
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
    flexDirection: "column",
    gap: "8px",
  },

  metricLabel: {
    color:
      theme.colors.textMuted,
    fontSize: "12px",
    fontWeight: "900",
    textTransform:
      "uppercase",
    letterSpacing: "0.04em",
  },

  metricValue: {
    color:
      theme.colors.textPrimary,
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
    color:
      theme.colors.textSecondary,
    fontSize: "14px",
    lineHeight: 1.5,
  },
  
  input: {
    width: "100%",
    minWidth: 72,
    padding: "10px 12px",
    borderRadius:
      theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    background:
      theme.colors.surface,
    color:
      theme.colors.textPrimary,
    fontSize: "14px",
    fontWeight: "700",
  },
};