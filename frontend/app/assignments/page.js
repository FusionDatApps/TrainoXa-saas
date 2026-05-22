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
import ActionButton from "../../components/ui/ActionButton";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import PageHeader from "../../components/ui/PageHeader";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import StatCard from "../../components/ui/StatCard";
import StateRenderer from "../../components/ui/StateRenderer";

export const dynamic = "force-dynamic";

export default function AssignmentsPage() {
  const [clients, setClients] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [assignments, setAssignments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [clientId, setClientId] =
    useState("");

  const [workoutPlanId, setWorkoutPlanId] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const [deactivatingId, setDeactivatingId] =
    useState(null);

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

  const inactiveAssignments = useMemo(
    () =>
      assignments.filter(
        (assignment) => !assignment.isActive
      ),
    [assignments]
  );

  async function loadData() {
    setLoading(true);

    try {
      const [
        clientsRes,
        workoutsRes,
        assignmentsRes,
      ] = await Promise.all([
        apiFetch("/clients"),
        apiFetch("/workouts"),
        apiFetch("/assignments"),
      ]);

      setClients(clientsRes.data || []);
      setWorkouts(workoutsRes.data || []);

      setAssignments(
        assignmentsRes.data || []
      );
    } catch (err) {
      console.error(
        "Error cargando asignaciones:",
        err.message
      );

      setError(extractApiError(err));
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

          startDate:
            startDate || undefined,

          endDate:
            endDate || undefined,
        }),
      });

      setClientId("");
      setWorkoutPlanId("");
      setStartDate("");
      setEndDate("");

      setSuccess(
        "Rutina asignada correctamente"
      );

      await loadData();
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleDeactivate(
    assignmentId
  ) {
    try {
      setDeactivatingId(assignmentId);

      setError("");
      setSuccess("");

      await apiFetch(
        `/assignments/${assignmentId}/deactivate`,
        {
          method: "PATCH",
        }
      );

      setSuccess(
        "Asignación desactivada correctamente"
      );

      await loadData();
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setDeactivatingId(null);
    }
  }

  const assignmentColumns = [
    {
      key: "client",

      label: "Cliente",

      render: (assignment) => (
        <span style={styles.primaryText}>
          {assignment.client?.fullName ||
            "Cliente sin nombre"}
        </span>
      ),
    },

    {
      key: "workout",

      label: "Rutina",

      render: (assignment) => (
        <span style={styles.primaryText}>
          {assignment.workoutPlan?.name ||
            "Rutina sin nombre"}
        </span>
      ),
    },

    {
      key: "status",

      label: "Estado",

      render: (assignment) => (
        <Badge
          variant={
            assignment.isActive
              ? "success"
              : "default"
          }
        >
          {assignment.isActive
            ? "Activa"
            : "Inactiva"}
        </Badge>
      ),
    },

    {
      key: "startDate",

      label: "Inicio",

      render: (assignment) =>
        assignment.startDate
          ? new Date(
              assignment.startDate
            ).toLocaleDateString()
          : "N/A",
    },

    {
      key: "endDate",

      label: "Fin",

      render: (assignment) =>
        assignment.endDate
          ? new Date(
              assignment.endDate
            ).toLocaleDateString()
          : "N/A",
    },

    {
      key: "actions",

      label: "Acción",

      render: (assignment) =>
        assignment.isActive ? (
          <ActionButton
            variant="danger"
            onClick={() =>
              handleDeactivate(
                assignment.id
              )
            }
            disabled={
              deactivatingId ===
              assignment.id
            }
          >
            {deactivatingId ===
            assignment.id
              ? "Desactivando..."
              : "Desactivar"}
          </ActionButton>
        ) : (
          <Badge>
            Asignación finalizada
          </Badge>
        ),
    },
  ];

  return (
    <TrainerShell
      title="Asignaciones"
      active="assignments"
    >
      <PageContainer>
        <div style={uiStyles.page}>
          <section style={styles.topGrid}>
            <SectionCard
              style={styles.formCard}
            >
              <PageHeader
                eyebrow="Sistema de asignaciones"
                title="Asignar rutina"
                description="Conecta clientes reales con rutinas activas creadas por el trainer."
              />

              {clients.length === 0 ? (
                <FeedbackMessage variant="warning">
                  Debes crear al menos un
                  cliente antes de asignar
                  rutinas.
                </FeedbackMessage>
              ) : null}

              {workouts.length === 0 ? (
                <FeedbackMessage variant="warning">
                  Debes crear al menos una
                  rutina antes de crear
                  asignaciones.
                </FeedbackMessage>
              ) : null}

              <form
                onSubmit={handleSubmit}
                style={uiStyles.stack}
              >
                <div style={uiStyles.stack}>
                  <label style={styles.label}>
                    Cliente
                  </label>

                  <select
                    style={styles.select}
                    value={clientId}
                    onChange={(e) =>
                      setClientId(
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">
                      Selecciona cliente
                    </option>

                    {clients.map((client) => (
                      <option
                        key={client.id}
                        value={client.id}
                      >
                        {client.fullName ||
                          "Cliente sin nombre"}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={uiStyles.stack}>
                  <label style={styles.label}>
                    Rutina
                  </label>

                  <select
                    style={styles.select}
                    value={workoutPlanId}
                    onChange={(e) =>
                      setWorkoutPlanId(
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">
                      Selecciona rutina
                    </option>

                    {workouts.map(
                      (workout) => (
                        <option
                          key={workout.id}
                          value={workout.id}
                        >
                          {workout.name ||
                            "Rutina sin nombre"}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div style={styles.twoColumns}>
                  <div style={uiStyles.stack}>
                    <label
                      style={styles.label}
                    >
                      Fecha inicio
                    </label>

                    <input
                      style={styles.select}
                      type="date"
                      value={startDate}
                      onChange={(e) =>
                        setStartDate(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div style={uiStyles.stack}>
                    <label
                      style={styles.label}
                    >
                      Fecha fin
                    </label>

                    <input
                      style={styles.select}
                      type="date"
                      value={endDate}
                      onChange={(e) =>
                        setEndDate(
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div style={styles.actions}>
                  <ActionButton
                    disabled={
                      creating ||
                      clients.length ===
                        0 ||
                      workouts.length === 0
                    }
                  >
                    {creating
                      ? "Asignando..."
                      : "Asignar rutina"}
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

            <div style={uiStyles.stack}>
              <StatCard
                label="Asignaciones"
                value={assignments.length}
                description="Total de relaciones activas e históricas entre clientes y rutinas."
              />

              <StatCard
                label="Activas"
                value={activeAssignments.length}
                description="Asignaciones actualmente en ejecución."
              />

              <StatCard
                label="Finalizadas"
                value={inactiveAssignments.length}
                description="Asignaciones desactivadas o completadas."
              />
            </div>
          </section>

          <SectionCard
            style={styles.tableSection}
          >
            <div style={uiStyles.sectionHeader}>
              <div>
                <p style={styles.eyebrow}>
                  Gestión operativa
                </p>

                <h2
                  style={
                    uiStyles.sectionTitle
                  }
                >
                  Lista de asignaciones
                </h2>
              </div>

              <Badge variant="default">
                {assignments.length} registros
              </Badge>
            </div>

            <StateRenderer
              loading={loading}
              error={error}
              isEmpty={
                !loading &&
                assignments.length === 0
              }
              loadingMessage="Cargando asignaciones..."
              emptyMessage="Todavía no tienes rutinas asignadas."
            >
              <DataTable
                columns={assignmentColumns}
                data={assignments}
                emptyMessage="Todavía no tienes rutinas asignadas."
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
    minHeight: "auto",
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

  actions: {
    display: "flex",

    justifyContent: "flex-start",

    marginTop: "8px",
  },

  primaryText: {
    fontWeight: "800",

    color: "#f8fafc",
  },
};