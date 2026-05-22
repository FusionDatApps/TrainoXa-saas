"use client";

import { useEffect, useMemo, useState } from "react";
import TrainerShell from "../../components/TrainerShell";

import { apiFetch } from "../../lib/api";

import SectionCard from "../../components/ui/SectionCard";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import ActionButton from "../../components/ui/ActionButton";
import DataTable from "../../components/ui/DataTable";

export const dynamic = "force-dynamic";

export default function ProgressPage() {
  const [assignments, setAssignments] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);

  const [assignmentId, setAssignmentId] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [performedAt, setPerformedAt] = useState("");
  const [repsCompleted, setRepsCompleted] = useState("");
  const [weightUsedKg, setWeightUsedKg] = useState("");
  const [completed, setCompleted] = useState(true);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.isActive),
    [assignments]
  );

  const selectedAssignment = useMemo(
    () =>
      assignments.find((assignment) => assignment.id === assignmentId) || null,
    [assignments, assignmentId]
  );

  async function loadAssignments() {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/assignments");

      const data = response.data || [];

      setAssignments(data);

      const firstActive = data.find((assignment) => assignment.isActive);

      if (firstActive) {
        setAssignmentId(firstActive.id);
      }
    } catch (err) {
      setError(err.message || "No se pudieron cargar las asignaciones");
    } finally {
      setLoading(false);
    }
  }

  async function loadWorkoutExercises(workoutPlanId) {
    if (!workoutPlanId) {
      setWorkoutExercises([]);
      return;
    }

    setLoadingExercises(true);
    setError("");

    try {
      const response = await apiFetch(`/workouts/${workoutPlanId}/exercises`);

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
      setError(err.message || "No se pudieron cargar los ejercicios");
    } finally {
      setLoadingExercises(false);
    }
  }

  async function loadProgress(selectedAssignmentId) {
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
      setError(err.message || "No se pudo cargar el progreso");
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

    loadWorkoutExercises(selectedAssignment.workoutPlanId);

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
            ? new Date(performedAt).toISOString()
            : undefined,
          repsCompleted: repsCompleted || undefined,
          weightUsedKg: weightUsedKg ? Number(weightUsedKg) : undefined,
          completed,
          notes: notes || undefined,
        }),
      });

      setPerformedAt("");
      setRepsCompleted("");
      setWeightUsedKg("");
      setCompleted(true);
      setNotes("");

      setSuccess("Progreso registrado correctamente");

      await loadProgress(assignmentId);
    } catch (err) {
      setError(err.message || "No se pudo registrar el progreso");
    } finally {
      setCreating(false);
    }
  }

  const columns = [
    {
      key: "exercise",
      label: "Ejercicio",
      render: (row) => row.exercise?.name || "Sin nombre",
    },

    {
      key: "repsCompleted",
      label: "Reps",
      render: (row) => row.repsCompleted || "N/A",
    },

    {
      key: "weightUsedKg",
      label: "Peso",
      render: (row) =>
        row.weightUsedKg ? `${row.weightUsedKg} kg` : "N/A",
    },

    {
      key: "completed",
      label: "Estado",
      render: (row) =>
        row.completed ? (
          <Badge variant="success">Completado</Badge>
        ) : (
          <Badge variant="warning">Pendiente</Badge>
        ),
    },

    {
      key: "performedAt",
      label: "Fecha",
      render: (row) =>
        row.performedAt
          ? new Date(row.performedAt).toLocaleString()
          : "N/A",
    },
  ];

  return (
    <TrainerShell title="Progreso" active="progress">
      <section style={styles.grid}>
        <SectionCard style={styles.formWrapper}>
          <h2 style={styles.sectionTitle}>Registrar progreso</h2>

          <p style={styles.sectionText}>
            Registra la ejecución real del entrenamiento del cliente.
          </p>

          {activeAssignments.length === 0 ? (
            <EmptyState>
              No tienes asignaciones activas para registrar progreso.
            </EmptyState>
          ) : null}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Asignación activa</label>

              <select
                style={styles.input}
                value={assignmentId}
                onChange={(e) => setAssignmentId(e.target.value)}
                required
              >
                <option value="">Selecciona asignación</option>

                {activeAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {(assignment.client?.fullName || "Cliente sin nombre") +
                      " - " +
                      (assignment.workoutPlan?.name || "Rutina sin nombre")}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Ejercicio</label>

              <select
                style={styles.input}
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                required
                disabled={loadingExercises || workoutExercises.length === 0}
              >
                <option value="">
                  {loadingExercises
                    ? "Cargando ejercicios..."
                    : "Selecciona ejercicio"}
                </option>

                {workoutExercises.map((item) => (
                  <option key={item.id} value={item.exerciseId}>
                    {item.exercise?.name || "Ejercicio sin nombre"}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Fecha y hora</label>

              <input
                style={styles.input}
                type="datetime-local"
                value={performedAt}
                onChange={(e) => setPerformedAt(e.target.value)}
              />
            </div>

            <div style={styles.twoColumns}>
              <div style={styles.field}>
                <label style={styles.label}>Repeticiones</label>

                <input
                  style={styles.input}
                  value={repsCompleted}
                  onChange={(e) => setRepsCompleted(e.target.value)}
                  placeholder="Ej: 10, 8-10"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Peso usado kg</label>

                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="0.5"
                  value={weightUsedKg}
                  onChange={(e) => setWeightUsedKg(e.target.value)}
                  placeholder="Ej: 80"
                />
              </div>
            </div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />

              Ejercicio completado
            </label>

            <div style={styles.field}>
              <label style={styles.label}>Notas</label>

              <textarea
                style={styles.textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones del entrenamiento"
              />
            </div>

            <ActionButton
              disabled={
                creating ||
                activeAssignments.length === 0 ||
                workoutExercises.length === 0
              }
            >
              {creating ? "Registrando..." : "Registrar progreso"}
            </ActionButton>

            {error ? <p style={styles.error}>{error}</p> : null}
            {success ? <p style={styles.success}>{success}</p> : null}
          </form>
        </SectionCard>

        <StatCard
          label="Asignaciones activas"
          value={activeAssignments.length}
          description="El progreso solo puede registrarse sobre asignaciones activas."
        />
      </section>

      <section style={styles.tableSection}>
        <h2 style={styles.sectionTitle}>Historial de progreso</h2>

        {loading || loadingProgress ? (
          <LoadingCard>Cargando progreso...</LoadingCard>
        ) : null}

        {!loading &&
        !loadingProgress &&
        progressLogs.length === 0 ? (
          <SectionCard>
            <EmptyState>
              Todavía no hay progreso registrado para esta asignación.
            </EmptyState>
          </SectionCard>
        ) : null}

        {!loading &&
        !loadingProgress &&
        progressLogs.length > 0 ? (
          <DataTable
            columns={columns}
            data={progressLogs}
            emptyMessage="No hay registros de progreso"
          />
        ) : null}
      </section>
    </TrainerShell>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
    marginBottom: "32px",
  },

  formWrapper: {
    minHeight: "unset",
  },

  sectionTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    fontWeight: "800",
  },

  sectionText: {
    margin: "0 0 18px 0",
    color: "#94a3b8",
    lineHeight: 1.5,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "700",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    minHeight: "92px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#cbd5e1",
    fontWeight: "700",
  },

  tableSection: {
    marginTop: "16px",
  },

  error: {
    margin: 0,
    color: "#f87171",
    fontSize: "14px",
  },

  success: {
    margin: 0,
    color: "#4ade80",
    fontSize: "14px",
  },
};