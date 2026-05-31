"use client";

import InlineGroup from "../ui/InlineGroup";

import { theme } from "../../lib/theme";

export default function WorkoutExerciseRowEditor({
  item,
}) {
  return (
    <InlineGroup gap={8} align="center">
      <span style={styles.exerciseName}>
        {item.exercise?.name || "Sin nombre"}
      </span>

      {item.optimistic ? (
        <span style={styles.optimisticText}>
          · Agregando...
        </span>
      ) : null}
    </InlineGroup>
  );
}

const styles = {
  exerciseName: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },

  optimisticText: {
    color: theme.colors.textMuted,
    fontSize: "12px",
    fontWeight: "700",
  },
};
