"use client";

import { useEffect, useState } from "react";
import TrainerShell from "../../components/TrainerShell";

import SectionCard from "../../components/ui/SectionCard";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";
import ActionButton from "../../components/ui/ActionButton";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";

import { apiFetch } from "../../lib/api";

export const dynamic = "force-dynamic";

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

  const activeAssignments = assignments.filter(
    (assignment) => assignment.isActive
  );

  const inactiveAssignments = assignments.filter(
    (assignment) => !assignment.isActive
  );

  async function loadData() {
    setLoading(true);

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

  const assignmentColumns = [
    {
      key: "client",
      label: "Cliente",
      render: (assignment) =>
        assignment.client?.fullName || "Cliente sin nombre",
    },
    {
      key: "workout",
      label: "Rutina",
      render: (assignment) =>
        assignment.workoutPlan?.name || "Rutina sin nombre",
    },
    {
      key: "status",
      label: "Estado",
      render: (assignment) => (
        <Badge variant={assignment.isActive ? "success" : "default"}>
          {assignment.isActive ? "Activa" : "Inactiva"}
        </Badge>
      ),
    },
    {
      key: "startDate",
      label: "Inicio",
      render: (assignment) =>
        assignment.startDate
          ? new Date(assignment.startDate).toLocaleDateString()
          : "N/A",
    },
    {
      key: "endDate",
      label: "Fin",
      render: (assignment) =>
        assignment.endDate
          ? new Date(assignment.endDate).toLocaleDateString()
          : "N/A",
    },
    {
      key: "actions",
      label: "Acción",
      render: (assignment) =>
        assignment.isActive ? (
          <ActionButton
            variant="danger"
            onClick={() => handleDeactivate(assignment.id)}
            disabled={deactivatingId === assignment.id}
          >
            {deactivatingId === assignment.id ? "Desactivando..." : "Desactivar"}
          </ActionButton>
        ) : (
          <Badge>Asignación finalizada</Badge>
        ),
    },
  ];

  return (
    <TrainerShell title="Asignaciones" active="assignments">
      <section style={styles.grid}>
        <SectionCard style={styles.formCardOverride}>
          <h2 style={styles.sectionTitle}>Asignar rutina</h2>

          <p style={styles.sectionText}>
            Selecciona un cliente y una rutina para crear una asignación real.
          </p>

          {clients.length === 0 ? (
            <p style={styles.error}>
              Debes crear al menos un cliente antes de asignar rutinas.
            </p>
          ) : null}

          {workouts.length === 0 ? (
            <p style={styles.error}>
              Debes crear al menos una rutina antes de crear asignaciones.
            </p>
          ) : null}

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

            <ActionButton
              variant="primary"
              disabled={creating || clients.length === 0 || workouts.length === 0}
            >
              {creating ? "Asignando..." : "Asignar rutina"}
            </ActionButton>

            {error ? <p style={styles.error}>{error}</p> : null}
            {success ? <p style={styles.success}>{success}</p> : null}
          </form>
        </SectionCard>

        <SectionCard style={styles.summaryCardOverride}>
          <p style={styles.summaryLabel}>Total asignaciones</p>

          <h3 style={styles.summaryValue}>{assignments.length}</h3>

          <div style={styles.summaryStats}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{activeAssignments.length}</span>
              <span style={styles.statLabel}>Activas</span>
            </div>

            <div style={styles.statCard}>
              <span style={styles.statNumber}>{inactiveAssignments.length}</span>
              <span style={styles.statLabel}>Inactivas</span>
            </div>
          </div>

          <p style={styles.summaryText}>
            Cada asignación conecta un cliente con una rutina creada por el
            trainer.
          </p>
        </SectionCard>
      </section>

      <section style={styles.listSection}>
        <h2 style={styles.sectionTitle}>Lista de asignaciones</h2>

        {loading ? (
          <LoadingCard>Cargando asignaciones...</LoadingCard>
        ) : null}

        {!loading && assignments.length === 0 ? (
          <SectionCard>
            <EmptyState>Todavía no tienes rutinas asignadas.</EmptyState>
          </SectionCard>
        ) : null}

        {!loading && assignments.length > 0 ? (
          <DataTable
            columns={assignmentColumns}
            data={assignments}
            emptyMessage="Todavía no tienes rutinas asignadas."
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

  formCardOverride: {
    minHeight: "auto",
  },

  summaryCardOverride: {
    minHeight: "auto",
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

  summaryStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "18px",
  },

  statCard: {
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  statNumber: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#f8fafc",
  },

  statLabel: {
    fontSize: "13px",
    color: "#94a3b8",
    textTransform: "uppercase",
  },

  summaryText: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.5,
  },

  listSection: {
    marginTop: "16px",
  },
};