"use client";

import { useEffect, useState } from "react";
import TrainerShell from "../../components/TrainerShell";
import { apiFetch } from "../../lib/api";

export default function AssignmentsPage() {
  const [clients, setClients] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [clientId, setClientId] = useState("");
  const [workoutPlanId, setWorkoutPlanId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [creating, setCreating] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      const [clientsRes, workoutsRes, assignmentsRes] = await Promise.all([
        apiFetch("/clients"),
        apiFetch("/workouts"),
        apiFetch("/assignments"),
      ]);

      setClients(clientsRes.data || []);
      setWorkouts(workoutsRes.data || []);
      setAssignments(assignmentsRes.data || []);
    } catch (err) {
      console.error("Error cargando asignaciones:", err.message);
      setError(err.message || "No se pudo cargar la información");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch("/assignments", {
        method: "POST",
        body: JSON.stringify({
          clientId,
          workoutPlanId,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      });

      setClientId("");
      setWorkoutPlanId("");
      setStartDate("");
      setEndDate("");

      setSuccess("Rutina asignada correctamente");

      await loadData();
    } catch (err) {
      setError(err.message || "No se pudo crear la asignación");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeactivate(assignmentId) {
    try {
      setDeactivatingId(assignmentId);
      setError("");
      setSuccess("");

      await apiFetch(`/assignments/${assignmentId}/deactivate`, {
        method: "PATCH",
      });

      setSuccess("Asignación desactivada correctamente");

      await loadData();
    } catch (err) {
      setError(err.message || "No se pudo desactivar la asignación");
    } finally {
      setDeactivatingId(null);
    }
  }

  return (
    <TrainerShell title="Asignaciones" active="assignments">
      <section style={styles.grid}>
        <article style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Asignar rutina</h2>

          <p style={styles.sectionText}>
            Selecciona un cliente y una rutina para crear una asignación real.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Cliente</label>

              <select
                style={styles.input}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
              >
                <option value="">Selecciona cliente</option>

                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName || "Cliente sin nombre"}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Rutina</label>

              <select
                style={styles.input}
                value={workoutPlanId}
                onChange={(e) => setWorkoutPlanId(e.target.value)}
                required
              >
                <option value="">Selecciona rutina</option>

                {workouts.map((workout) => (
                  <option key={workout.id} value={workout.id}>
                    {workout.name || "Rutina sin nombre"}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Fecha inicio</label>

              <input
                style={styles.input}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Fecha fin</label>

              <input
                style={styles.input}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button type="submit" style={styles.button} disabled={creating}>
              {creating ? "Asignando..." : "Asignar rutina"}
            </button>

            {error ? <p style={styles.error}>{error}</p> : null}
            {success ? <p style={styles.success}>{success}</p> : null}
          </form>
        </article>

        <aside style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Total asignaciones</p>

          <h3 style={styles.summaryValue}>{assignments.length}</h3>

          <p style={styles.summaryText}>
            Cada asignación conecta un cliente con una rutina creada por el trainer.
          </p>
        </aside>
      </section>

      <section style={styles.listSection}>
        <h2 style={styles.sectionTitle}>Lista de asignaciones</h2>

        {loading ? (
          <div style={styles.emptyCard}>
            <p style={styles.sectionText}>Cargando asignaciones...</p>
          </div>
        ) : null}

        {!loading && assignments.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.sectionText}>
              Todavía no tienes rutinas asignadas.
            </p>
          </div>
        ) : null}

        {!loading && assignments.length > 0 ? (
          <div style={styles.assignmentGrid}>
            {assignments.map((assignment) => (
              <article key={assignment.id} style={styles.assignmentCard}>
                <p style={styles.assignmentTag}>Asignación</p>

                <h3 style={styles.assignmentName}>
                  {assignment.client?.fullName || "Cliente sin nombre"}
                </h3>

                <p style={styles.assignmentInfo}>
                  <strong>Rutina:</strong>{" "}
                  {assignment.workoutPlan?.name || "Rutina sin nombre"}
                </p>

                <p style={styles.assignmentInfo}>
                  <strong>Estado:</strong>{" "}
                  {assignment.isActive ? "Activa" : "Inactiva"}
                </p>

                <p style={styles.assignmentInfo}>
                  <strong>Inicio:</strong>{" "}
                  {assignment.startDate
                    ? new Date(assignment.startDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <p style={styles.assignmentInfo}>
                  <strong>Fin:</strong>{" "}
                  {assignment.endDate
                    ? new Date(assignment.endDate).toLocaleDateString()
                    : "N/A"}
                </p>

                {assignment.isActive ? (
                  <button
                    style={styles.deactivateButton}
                    onClick={() => handleDeactivate(assignment.id)}
                    disabled={deactivatingId === assignment.id}
                  >
                    {deactivatingId === assignment.id
                      ? "Desactivando..."
                      : "Desactivar"}
                  </button>
                ) : (
                  <div style={styles.inactiveBadge}>
                    Asignación finalizada
                  </div>
                )}
              </article>
            ))}
          </div>
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

  formCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
  },

  summaryCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
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

  button: {
    marginTop: "4px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#22c55e",
    color: "#052e16",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "15px",
  },

  deactivateButton: {
    marginTop: "12px",
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "14px",
  },

  inactiveBadge: {
    marginTop: "12px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "rgba(148, 163, 184, 0.14)",
    color: "#94a3b8",
    textAlign: "center",
    fontWeight: "700",
    fontSize: "14px",
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

  summaryLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },

  summaryValue: {
    margin: "12px 0",
    fontSize: "56px",
    fontWeight: "800",
  },

  summaryText: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.5,
  },

  listSection: {
    marginTop: "16px",
  },

  emptyCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
  },

  assignmentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },

  assignmentCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "22px",
  },

  assignmentTag: {
    margin: "0 0 10px 0",
    color: "#94a3b8",
    fontSize: "13px",
    textTransform: "uppercase",
  },

  assignmentName: {
    margin: "0 0 16px 0",
    fontSize: "30px",
    fontWeight: "800",
  },

  assignmentInfo: {
    margin: "0 0 10px 0",
    color: "#e2e8f0",
    lineHeight: 1.5,
  },
};