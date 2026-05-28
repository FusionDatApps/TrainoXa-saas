"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import TrainerShell from "../../components/TrainerShell";

import { apiFetch } from "../../lib/api";
import useFetch from "../../hooks/useFetch";
import useMutation from "../../hooks/useMutation";
import useDependentFetch from "../../hooks/useDependentFetch";
import { uiStyles } from "../../lib/ui-styles";
import { layoutStyles } from "../../lib/layout-styles";

import PageContainer from "../../components/ui/PageContainer";
import SectionCard from "../../components/ui/SectionCard";
import EmptyState from "../../components/ui/EmptyState";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import StateRenderer from "../../components/ui/StateRenderer";
import FormActions from "../../components/ui/FormActions";

export const dynamic = "force-dynamic";

export default function ProgressPage() {
  const {
    data: assignments = [],
    loading,
    error: assignmentsError,
    refetch: refetchAssignments,
  } = useFetch("/assignments", {
    initialData: [],
  });

  const [assignmentId, setAssignmentId] =
    useState("");

  const [exerciseId, setExerciseId] =
    useState("");

  const [performedAt, setPerformedAt] =
    useState("");

  const [repsCompleted, setRepsCompleted] =
    useState("");

  const [weightUsedKg, setWeightUsedKg] =
    useState("");

  const [completed, setCompleted] =
    useState(true);

  const [notes, setNotes] = useState("");

  const {
    loading: creating,
    error,
    success,
    mutate: createProgress,
    setSuccessMessage,
  } = useMutation(async (payload) => {
    return apiFetch("/progress", {
      method: "POST",

      body: JSON.stringify(payload),
    });
  });

  const activeAssignments = useMemo(
    () =>
      assignments.filter(
        (assignment) => assignment.isActive
      ),
    [assignments]
  );

  const selectedAssignment = useMemo(
    () =>
      assignments.find(
        (assignment) =>
          assignment.id === assignmentId
      ) || null,
    [assignments, assignmentId]
  );

  useEffect(() => {
    if (
      !assignmentId &&
      activeAssignments.length > 0
    ) {
      setAssignmentId(
        activeAssignments[0].id
      );
    }
  }, [activeAssignments, assignmentId]);

  const fetchWorkoutExercises = useCallback(
    async (workoutPlanId) => {
      const response = await apiFetch(
        `/workouts/${workoutPlanId}/exercises`
      );

      return response.data || [];
    },
    []
  );

  const fetchProgressLogs = useCallback(
    async (selectedAssignmentId) => {
      const response = await apiFetch(
        `/progress/assignment/${selectedAssignmentId}`
      );

      return response.data || [];
    },
    []
  );

  const {
    data: workoutExercises = [],
    loading: loadingExercises,
    error: workoutExercisesError,
    refetch: refetchWorkoutExercises,
  } = useDependentFetch(
    selectedAssignment?.workoutPlanId,
    fetchWorkoutExercises,
    {
      initialData: [],
    }
  );

  const {
    data: progressLogs = [],
    loading: loadingProgress,
    error: progressLogsError,
    refetch: refetchProgressLogs,
  } = useDependentFetch(
    selectedAssignment?.id,
    fetchProgressLogs,
    {
      initialData: [],
    }
  );

  useEffect(() => {
    if (workoutExercises.length > 0) {
      setExerciseId(
        workoutExercises[0].exerciseId
      );
    } else {
      setExerciseId("");
    }
  }, [workoutExercises]);

  async function handleSubmit(e) {
    e.preventDefault();

    await createProgress({
      assignmentId,
      exerciseId,

      performedAt: performedAt
        ? new Date(
            performedAt
          ).toISOString()
        : undefined,

      repsCompleted:
        repsCompleted || undefined,

      weightUsedKg: weightUsedKg
        ? Number(weightUsedKg)
        : undefined,

      completed,

      notes: notes || undefined,
    });

    setPerformedAt("");
    setRepsCompleted("");
    setWeightUsedKg("");
    setCompleted(true);
    setNotes("");

    setSuccessMessage(
      "Progreso registrado correctamente"
    );

    await refetchProgressLogs();
    await refetchWorkoutExercises();
    await refetchAssignments();
  }

  const combinedError =
    assignmentsError ||
    workoutExercisesError ||
    progressLogsError ||
    error;

  const columns = [
    {
      key: "exercise",

      label: "Ejercicio",

      render: (row) => (
        <span style={styles.exerciseName}>
          {row.exercise?.name ||
            "Sin nombre"}
        </span>
      ),
    },

    {
      key: "repsCompleted",

      label: "Reps",

      render: (row) =>
        row.repsCompleted || "N/A",
    },

    {
      key: "weightUsedKg",

      label: "Peso",

      render: (row) =>
        row.weightUsedKg
          ? `${row.weightUsedKg} kg`
          : "N/A",
    },

    {
      key: "completed",

      label: "Estado",

      render: (row) =>
        row.completed ? (
          <Badge variant="success">
            Completado
          </Badge>
        ) : (
          <Badge variant="warning">
            Pendiente
          </Badge>
        ),
    },

    {
      key: "performedAt",

      label: "Fecha",

      render: (row) =>
        row.performedAt
          ? new Date(
              row.performedAt
            ).toLocaleString()
          : "N/A",
    },
  ];

  return (
    <TrainerShell
      title="Progreso"
      active="progress"
    >
      <PageContainer>
        <div style={uiStyles.page}>
          <section style={layoutStyles.topGrid}>
            <SectionCard style={styles.formCard}>
              <PageHeader
                eyebrow="Tracking fitness"
                title="Registrar progreso"
                description="Registra la ejecución real de los ejercicios realizados por el cliente."
              />

              {activeAssignments.length ===
              0 ? (
                <EmptyState>
                  No tienes asignaciones
                  activas para registrar
                  progreso.
                </EmptyState>
              ) : null}

              <form
                onSubmit={handleSubmit}
                style={uiStyles.stack}
              >
                <div style={uiStyles.stack}>
                  <label style={layoutStyles.label}>
                    Asignación activa
                  </label>

                  <select
                    style={layoutStyles.select}
                    value={assignmentId}
                    onChange={(e) =>
                      setAssignmentId(
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">
                      Selecciona asignación
                    </option>

                    {activeAssignments.map(
                      (assignment) => (
                        <option
                          key={assignment.id}
                          value={assignment.id}
                        >
                          {(assignment.client
                            ?.fullName ||
                            "Cliente sin nombre") +
                            " - " +
                            (assignment
                              .workoutPlan
                              ?.name ||
                              "Rutina sin nombre")}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div style={uiStyles.stack}>
                  <label style={layoutStyles.label}>
                    Ejercicio
                  </label>

                  <select
                    style={layoutStyles.select}
                    value={exerciseId}
                    onChange={(e) =>
                      setExerciseId(
                        e.target.value
                      )
                    }
                    required
                    disabled={
                      loadingExercises ||
                      workoutExercises.length ===
                        0
                    }
                  >
                    <option value="">
                      {loadingExercises
                        ? "Cargando ejercicios..."
                        : "Selecciona ejercicio"}
                    </option>

                    {workoutExercises.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={
                            item.exerciseId
                          }
                        >
                          {item.exercise
                            ?.name ||
                            "Ejercicio sin nombre"}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <FormField
                  label="Fecha y hora"
                  type="datetime-local"
                  value={performedAt}
                  onChange={(e) =>
                    setPerformedAt(
                      e.target.value
                    )
                  }
                />

                <div style={layoutStyles.twoColumns}>
                  <FormField
                    label="Repeticiones"
                    placeholder="Ej: 10, 8-10"
                    value={repsCompleted}
                    onChange={(e) =>
                      setRepsCompleted(
                        e.target.value
                      )
                    }
                  />

                  <FormField
                    label="Peso usado kg"
                    type="number"
                    placeholder="Ej: 80"
                    value={weightUsedKg}
                    onChange={(e) =>
                      setWeightUsedKg(
                        e.target.value
                      )
                    }
                  />
                </div>

                <label
                  style={styles.checkboxRow}
                >
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) =>
                      setCompleted(
                        e.target.checked
                      )
                    }
                  />

                  Ejercicio completado
                </label>

                <FormField
                  label="Notas"
                  placeholder="Observaciones del entrenamiento"
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  textarea
                />

                <FormActions
                  loading={creating}
                  submitText="Registrar progreso"
                />

                {combinedError ? (
                  <FeedbackMessage variant="error">
                    {combinedError}
                  </FeedbackMessage>
                ) : null}

                {success ? (
                  <FeedbackMessage variant="success">
                    {success}
                  </FeedbackMessage>
                ) : null}
              </form>
            </SectionCard>

            <StatCard
              label="Asignaciones activas"
              value={activeAssignments.length}
              description="El progreso solo puede registrarse sobre asignaciones activas."
            />
          </section>

          <SectionCard
            style={styles.tableSection}
          >
            <div style={uiStyles.sectionHeader}>
              <div>
                <p style={layoutStyles.eyebrow}>
                  Historial fitness
                </p>

                <h2
                  style={
                    uiStyles.sectionTitle
                  }
                >
                  Historial de progreso
                </h2>
              </div>

              <Badge variant="default">
                {progressLogs.length} registros
              </Badge>
            </div>

            <StateRenderer
              loading={
                loading || loadingProgress
              }
              error={combinedError}
              isEmpty={
                !loading &&
                !loadingProgress &&
                progressLogs.length === 0
              }
              loadingMessage="Cargando progreso..."
              emptyMessage="Todavía no hay progreso registrado para esta asignación."
            >
              <DataTable
                columns={columns}
                data={progressLogs}
                emptyMessage="No hay registros de progreso"
              />
            </StateRenderer>
          </SectionCard>
        </div>
      </PageContainer>
    </TrainerShell>
  );
}

const styles = {
  formCard: {
    minHeight: "unset",
  },

  tableSection: {
    minHeight: "auto",
  },

  checkboxRow: {
    display: "flex",

    alignItems: "center",

    gap: "10px",

    color: "#cbd5e1",

    fontWeight: "700",
  },

  exerciseName: {
    fontWeight: "800",

    color: "#f8fafc",
  },
};