"use client";

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
  onRequestRemove,
}) {
  function buildColumns() {
    return [
      {
        key: "order",
        label: "#",
        render: (row) => row.exerciseOrder,
      },
      {
        key: "exercise",
        label: "Ejercicio",
        render: (row) => (
          <WorkoutExerciseRowEditor item={row} />
        ),
      },
      {
        key: "sets",
        label: "Sets/Reps",
        render: (row) => `${row.sets} x ${row.reps}`,
      },
      {
        key: "rest",
        label: "Descanso",
        render: (row) => `${row.restSeconds || 0}s`,
      },
      {
        key: "actions",
        label: "Acciones",
        render: (row) => (
          <ActionButton
            variant="danger"
            disabled={removingExercise[row.id] || row.optimistic}
            onClick={() => onRequestRemove(workoutId, row.id)}
          >
            {removingExercise[row.id] ? "Eliminando..." : "Eliminar"}
          </ActionButton>
        ),
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
};
