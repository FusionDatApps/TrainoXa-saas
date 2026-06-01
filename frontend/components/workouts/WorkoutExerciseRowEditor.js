"use client";

import InlineGroup from "../ui/InlineGroup";

import { theme } from "../../lib/theme";

export default function WorkoutExerciseRowEditor({
  item,
  editing = false,
}) {
  function renderStatus() {
    if (editing) {
      return (
        <span style={styles.editingText}>
          · Editando
        </span>
      );
    }

    if (item.syncStatus === "saving") {
      return (
        <span style={styles.savingText}>
          · Guardando...
        </span>
      );
    }

    if (item.syncStatus === "saved") {
      return (
        <span style={styles.savedText}>
          · Guardado
        </span>
      );
    }

    if (item.syncStatus === "error") {
      return (
        <span style={styles.errorText}>
          · Error
        </span>
      );
    }

    if (item.optimistic) {
      return (
        <span style={styles.optimisticText}>
          · Agregando...
        </span>
      );
    }

    return null;
  }

  return (
    <InlineGroup gap={8} align="center">
      <span style={styles.exerciseName}>
        {item.exercise?.name || "Sin nombre"}
      </span>

      {renderStatus()}
    </InlineGroup>
  );
}

const styles = {
  exerciseName: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },

  editingText: {
    color:
      theme.colors.warning ||
      "#facc15",

    fontSize: "12px",

    fontWeight: "800",
  },

  optimisticText: {
    color:
      theme.colors.textMuted,

    fontSize: "12px",

    fontWeight: "700",
  },

  savingText: {
    color: "#f59e0b",

    fontSize: "12px",

    fontWeight: "800",
  },

  savedText: {
    color: "#22c55e",

    fontSize: "12px",

    fontWeight: "800",
  },

  errorText: {
    color: "#ef4444",

    fontSize: "12px",

    fontWeight: "800",
  },
};