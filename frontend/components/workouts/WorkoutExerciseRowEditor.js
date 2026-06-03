"use client";

import { theme } from "../../lib/theme";

import AsyncStatusBadge from "../ui/AsyncStatusBadge";
import InlineGroup from "../ui/InlineGroup";

export default function WorkoutExerciseRowEditor({
  item,
  editing = false,
}) {
  function renderStatus() {
    if (editing) {
      return (
        <AsyncStatusBadge
          status="syncing"
          label="Editando"
        />
      );
    }

    if (item.syncStatus === "saving") {
      return (
        <AsyncStatusBadge
          status="saving"
        />
      );
    }

    if (item.syncStatus === "saved") {
      return (
        <AsyncStatusBadge
          status="saved"
        />
      );
    }

    if (item.syncStatus === "error") {
      return (
        <AsyncStatusBadge
          status="error"
        />
      );
    }

    if (item.optimistic) {
      return (
        <AsyncStatusBadge
          status="syncing"
          label="Agregando..."
        />
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
  
};