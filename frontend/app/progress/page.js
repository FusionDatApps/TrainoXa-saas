"use client";

import { useEffect, useMemo, useState } from "react";

import TrainerShell from "../../components/TrainerShell";

import { apiFetch } from "../../lib/api";
import { extractApiError } from "../../lib/form-helpers";
import { uiStyles } from "../../lib/ui-styles";

import PageContainer from "../../components/ui/PageContainer";
import SectionCard from "../../components/ui/SectionCard";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import ActionButton from "../../components/ui/ActionButton";
import DataTable from "../../components/ui/DataTable";
import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import StateRenderer from "../../components/ui/StateRenderer";

export const dynamic = "force-dynamic";

export default function ProgressPage() {
  const [assignments, setAssignments] =
    useState([]);

  const [workoutExercises, setWorkoutExercises] =
    useState([]);

  const [progressLogs, setProgressLogs] =
    useState([]);

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

  const [loading, setLoading] =
    useState(true);

  const [loadingExercises, setLoadingExercises] =
    useState(false);

  const [loadingProgress, setLoadingProgress] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

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

  async function loadAssignments() {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(
        "/assignments"
      );

      const data = response.data || [];

      setAssignments(data);

      const firstActive = data.find(
        (assignment) => assignment.isActive
      );

      if (firstActive) {
        setAssignmentId(firstActive.id);
      }
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function loadWorkoutExercises(
    workoutPlanId
  ) {
    if (!workoutPlanId) {
      setWorkoutExercises([]);
      return;
    }

    setLoadingExercises(true);
    setError("");

    try {
      const response = await apiFetch(
        `/workouts/${workoutPlanId}/exercises`
      );

      const data = response.data || [];

      setWorkoutExercises(data);

      if (data.length > 0) {
        setExerciseId(data[0].exerciseId);
      } else {
        setExerciseId("");
      }
    } catch (err) {
      setWorkoutExercises([]);
      setExerciseId("");

      setError(extractApiError(err));
    } finally {
      setLoadingExercises(false);
    }
  }

  async function loadProgress(
    selectedAssignmentId
  ) {
    if (!selectedAssignmentId) {
      setProgressLogs([]);
      return;
    }

    setLoadingProgress(true);
    setError("");

    try {
      const response = await apiFetch(
        `/progress/assignment/${selectedAssignmentId}`
      );

      setProgressLogs(response.data || []);
    } catch (err) {
      setProgressLogs([]);

      setError(extractApiError(err));
    } finally {
      setLoadingProgress(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (!selectedAssignment) {
      setWorkoutExercises([]);
      setExerciseId("");
      setProgressLogs([]);
      return;
    }

    loadWorkoutExercises(
      selectedAssignment.workoutPlanId
    );

    loadProgress(selectedAssignment.id);
  }, [selectedAssignment]);

  async function handleSubmit(e) {
    e.preventDefault();

    setCreating(true);

    setError("");
    setSuccess("");

    try {
      await apiFetch("/progress", {
        method: "POST",

        body: JSON.stringify({
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
        }),
      });

      setPerformedAt("");
      setRepsCompleted("");
      setWeightUsedKg("");
      setCompleted(true);
      setNotes("");

      setSuccess(
        "Progreso registrado correctamente"
      );

      await loadProgress(assignmentId);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setCreating(false);
    }
  }

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
          <section style={styles.topGrid}>
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
                  <label style={styles.label}>
                    Asignación activa
                  </label>

                  <select
                    style={styles.select}
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
                  <label style={styles.label}>
                    Ejercicio
                  </label>

                  <select
                    style={styles.select}
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

                <div style={styles.twoColumns}>
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

                <div style={styles.actions}>
                  <ActionButton
                    disabled={
                      creating ||
                      activeAssignments.length ===
                        0 ||
                      workoutExercises.length ===
                        0
                    }
                  >
                    {creating
                      ? "Registrando..."
                      : "Registrar progreso"}
                  </ActionButton>
                </div>

                {error ? (
                  <FeedbackMessage variant="error">
                    {error}
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
                <p style={styles.eyebrow}>
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
              error={error}
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
  topGrid: {
    display: "grid",

    gridTemplateColumns:
      "2fr minmax(260px, 320px)",

    gap: "18px",
  },

  formCard: {
    minHeight: "unset",
  },

  tableSection: {
    minHeight: "auto",
  },

  eyebrow: {
    margin: "0 0 10px 0",

    color: "#4ade80",

    fontSize: "12px",

    fontWeight: "900",

    textTransform: "uppercase",

    letterSpacing: "0.08em",
  },

  label: {
    color: "#e2e8f0",

    fontSize: "14px",

    fontWeight: "700",
  },

  select: {
    padding: "14px 16px",

    borderRadius: "12px",

    border: "1px solid #334155",

    background: "#0f172a",

    color: "#f8fafc",

    fontSize: "15px",

    outline: "none",
  },

  twoColumns: {
    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "14px",
  },

  checkboxRow: {
    display: "flex",

    alignItems: "center",

    gap: "10px",

    color: "#cbd5e1",

    fontWeight: "700",
  },

  actions: {
    display: "flex",

    justifyContent: "flex-start",

    marginTop: "8px",
  },

  exerciseName: {
    fontWeight: "800",

    color: "#f8fafc",
  },
};