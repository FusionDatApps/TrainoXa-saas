"use client";

import SectionCard from "../ui/SectionCard";
import ContentStack from "../ui/ContentStack";
import InlineGroup from "../ui/InlineGroup";
import ResponsiveGrid from "../ui/ResponsiveGrid";
import Badge from "../ui/Badge";
import ActionButton from "../ui/ActionButton";

import { theme } from "../../lib/theme";

export default function WorkoutSummaryCard({
  workout,
  assignedExercises = [],
  onManage,
}) {
  return (
    <SectionCard>
      <ContentStack gap={20}>
        <InlineGroup
          justify="space-between"
          align="flex-start"
        >
          <div>
            <p style={styles.workoutTag}>
              Rutina
            </p>

            <h3 style={styles.workoutName}>
              {workout.name || "Sin nombre"}
            </h3>

            <p style={styles.workoutDescription}>
              {workout.description || "Sin descripcion"}
            </p>
          </div>

          <Badge
            variant={
              workout.isActive
                ? "success"
                : "warning"
            }
          >
            {workout.optimistic
              ? "Creando..."
              : workout.isActive
                ? "Activa"
                : "Inactiva"}
          </Badge>
        </InlineGroup>

        <ResponsiveGrid
          min={160}
          gap={12}
        >
          <div style={styles.infoBox}>
            <p style={styles.infoLabel}>
              Ejercicios
            </p>

            <p style={styles.infoValue}>
              {assignedExercises.length}
            </p>
          </div>

          <div style={styles.infoBox}>
            <p style={styles.infoLabel}>
              Estado
            </p>

            <p style={styles.infoValue}>
              {workout.optimistic
                ? "Sincronizando"
                : workout.isActive
                  ? "Disponible"
                  : "Pausada"}
            </p>
          </div>
        </ResponsiveGrid>

        <ActionButton
          disabled={workout.optimistic}
          onClick={onManage}
        >
          {workout.optimistic
            ? "Creando rutina..."
            : "Gestionar rutina"}
        </ActionButton>
      </ContentStack>
    </SectionCard>
  );
}

const styles = {
  workoutTag: {
    margin: "0 0 8px 0",
    color: theme.colors.textMuted,
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "800",
  },

  workoutName: {
    margin: "0 0 8px 0",
    color: theme.colors.textPrimary,
    fontSize: "26px",
    fontWeight: "900",
  },

  workoutDescription: {
    margin: 0,
    color: theme.colors.textSecondary,
    lineHeight: 1.5,
  },

  infoBox: {
    padding: "14px",
    borderRadius: theme.radius.sm,
    background: "rgba(15, 23, 42, 0.72)",
    border: `1px solid ${theme.colors.border}`,
  },

  infoLabel: {
    margin: "0 0 6px 0",
    color: theme.colors.textMuted,
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  infoValue: {
    margin: 0,
    color: theme.colors.textPrimary,
    fontWeight: "900",
  },
};
