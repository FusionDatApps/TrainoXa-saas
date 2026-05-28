"use client";

import { useMemo, useState } from "react";

import TrainerShell from "../../components/TrainerShell";

import { apiFetch } from "../../lib/api";

import useFetch from "../../hooks/useFetch";
import useMutation from "../../hooks/useMutation";

import { uiStyles } from "../../lib/ui-styles";
import { layoutStyles } from "../../lib/layout-styles";

import PageContainer from "../../components/ui/PageContainer";
import SectionCard from "../../components/ui/SectionCard";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import PageHeader from "../../components/ui/PageHeader";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import StatCard from "../../components/ui/StatCard";
import StateRenderer from "../../components/ui/StateRenderer";
import FormActions from "../../components/ui/FormActions";
import ActionButton from "../../components/ui/ActionButton";
import SelectField from "../../components/ui/SelectField";

import ContentStack from "../../components/ui/ContentStack";
import InlineGroup from "../../components/ui/InlineGroup";
import PageSection from "../../components/ui/PageSection";
import ResponsiveGrid from "../../components/ui/ResponsiveGrid";

export const dynamic = "force-dynamic";

export default function AssignmentsPage() {
  const {
    data: clients = [],
    loading: loadingClients,
    error: clientsError,
    refetch: refetchClients,
  } = useFetch("/clients", {
    initialData: [],
  });

  const {
    data: workouts = [],
    loading: loadingWorkouts,
    error: workoutsError,
    refetch: refetchWorkouts,
  } = useFetch("/workouts", {
    initialData: [],
  });

  const {
    data: assignments = [],
    loading: loadingAssignments,
    error: assignmentsError,
    refetch: refetchAssignments,
  } = useFetch("/assignments", {
    initialData: [],
  });

  const [clientId, setClientId] =
    useState("");

  const [
    workoutPlanId,
    setWorkoutPlanId,
  ] = useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [
    deactivatingId,
    setDeactivatingId,
  ] = useState(null);

  const loading =
    loadingClients ||
    loadingWorkouts ||
    loadingAssignments;

  const fetchError =
    clientsError ||
    workoutsError ||
    assignmentsError;

  const activeAssignments = useMemo(
    () =>
      assignments.filter(
        (assignment) =>
          assignment.isActive
      ),
    [assignments]
  );

  const inactiveAssignments =
    useMemo(
      () =>
        assignments.filter(
          (assignment) =>
            !assignment.isActive
        ),
      [assignments]
    );

  const {
    loading: creating,
    error,
    success,
    mutate: createAssignment,
    setSuccessMessage,
  } = useMutation(async (payload) => {
    return apiFetch("/assignments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  });

  const {
    loading: deactivating,
    mutate: deactivateAssignment,
  } = useMutation(
    async (assignmentId) => {
      return apiFetch(
        `/assignments/${assignmentId}/deactivate`,
        {
          method: "PATCH",
        }
      );
    }
  );

  async function refetchData() {
    await Promise.all([
      refetchClients(),
      refetchWorkouts(),
      refetchAssignments(),
    ]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await createAssignment({
      clientId,
      workoutPlanId,

      startDate:
        startDate || undefined,

      endDate:
        endDate || undefined,
    });

    setClientId("");
    setWorkoutPlanId("");
    setStartDate("");
    setEndDate("");

    setSuccessMessage(
      "Rutina asignada correctamente"
    );

    await refetchData();
  }

  async function handleDeactivate(
    assignmentId
  ) {
    try {
      setDeactivatingId(assignmentId);

      await deactivateAssignment(
        assignmentId
      );

      setSuccessMessage(
        "Asignación desactivada correctamente"
      );

      await refetchAssignments();
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
          {assignment.client
            ?.fullName ||
            "Cliente sin nombre"}
        </span>
      ),
    },

    {
      key: "workout",

      label: "Rutina",

      render: (assignment) => (
        <span style={styles.primaryText}>
          {assignment.workoutPlan
            ?.name ||
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
              deactivating &&
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
        <ContentStack gap={24}>
          <PageSection>
            <ResponsiveGrid
              min={320}
              gap={20}
            >
              <SectionCard
                style={styles.formCard}
              >
                <ContentStack gap={24}>
                  <PageHeader
                    eyebrow="Sistema de asignaciones"
                    title="Asignar rutina"
                    description="Conecta clientes reales con rutinas activas creadas por el trainer."
                  />

                  {clients.length === 0 ? (
                    <FeedbackMessage variant="warning">
                      Debes crear al menos
                      un cliente antes de
                      asignar rutinas.
                    </FeedbackMessage>
                  ) : null}

                  {workouts.length ===
                  0 ? (
                    <FeedbackMessage variant="warning">
                      Debes crear al menos
                      una rutina antes de
                      crear asignaciones.
                    </FeedbackMessage>
                  ) : null}

                  <form
                    onSubmit={
                      handleSubmit
                    }
                    style={
                      uiStyles.stack
                    }
                  >
                    <SelectField
                      label="Cliente"
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

                      {clients.map(
                        (client) => (
                          <option
                            key={
                              client.id
                            }
                            value={
                              client.id
                            }
                          >
                            {client.fullName ||
                              "Cliente sin nombre"}
                          </option>
                        )
                      )}
                    </SelectField>

                    <SelectField
                      label="Rutina"
                      value={
                        workoutPlanId
                      }
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
                            key={
                              workout.id
                            }
                            value={
                              workout.id
                            }
                          >
                            {workout.name ||
                              "Rutina sin nombre"}
                          </option>
                        )
                      )}
                    </SelectField>

                    <InlineGroup
                      align="stretch"
                      gap={16}
                    >
                      <div
                        style={
                          styles.flexField
                        }
                      >
                        <ContentStack
                          gap={8}
                        >
                          <label
                            style={
                              layoutStyles.label
                            }
                          >
                            Fecha inicio
                          </label>

                          <input
                            style={
                              layoutStyles.select
                            }
                            type="date"
                            value={
                              startDate
                            }
                            onChange={(
                              e
                            ) =>
                              setStartDate(
                                e.target
                                  .value
                              )
                            }
                          />
                        </ContentStack>
                      </div>

                      <div
                        style={
                          styles.flexField
                        }
                      >
                        <ContentStack
                          gap={8}
                        >
                          <label
                            style={
                              layoutStyles.label
                            }
                          >
                            Fecha fin
                          </label>

                          <input
                            style={
                              layoutStyles.select
                            }
                            type="date"
                            value={endDate}
                            onChange={(
                              e
                            ) =>
                              setEndDate(
                                e.target
                                  .value
                              )
                            }
                          />
                        </ContentStack>
                      </div>
                    </InlineGroup>

                    <FormActions
                      loading={
                        creating
                      }
                      submitText="Asignar rutina"
                    />

                    {fetchError ? (
                      <FeedbackMessage variant="error">
                        {fetchError}
                      </FeedbackMessage>
                    ) : null}

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
                </ContentStack>
              </SectionCard>

              <ContentStack gap={16}>
                <StatCard
                  label="Asignaciones"
                  value={
                    assignments.length
                  }
                  description="Total de relaciones activas e históricas entre clientes y rutinas."
                />

                <StatCard
                  label="Activas"
                  value={
                    activeAssignments.length
                  }
                  description="Asignaciones actualmente en ejecución."
                />

                <StatCard
                  label="Finalizadas"
                  value={
                    inactiveAssignments.length
                  }
                  description="Asignaciones desactivadas o completadas."
                />
              </ContentStack>
            </ResponsiveGrid>
          </PageSection>

          <PageSection>
            <SectionCard
              style={
                styles.tableSection
              }
            >
              <ContentStack gap={24}>
                <InlineGroup justify="space-between">
                  <PageHeader
                    eyebrow="Gestión operativa"
                    title="Lista de asignaciones"
                    description="Visualiza el estado operativo de las relaciones entre clientes y rutinas."
                  />

                  <Badge variant="default">
                    {
                      assignments.length
                    }{" "}
                    registros
                  </Badge>
                </InlineGroup>

                <StateRenderer
                  loading={loading}
                  error={
                    fetchError ||
                    error
                  }
                  isEmpty={
                    !loading &&
                    assignments.length ===
                      0
                  }
                  loadingMessage="Cargando asignaciones..."
                  emptyMessage="Todavía no tienes rutinas asignadas."
                >
                  <DataTable
                    columns={
                      assignmentColumns
                    }
                    data={assignments}
                    emptyMessage="Todavía no tienes rutinas asignadas."
                  />
                </StateRenderer>
              </ContentStack>
            </SectionCard>
          </PageSection>
        </ContentStack>
      </PageContainer>
    </TrainerShell>
  );
}

const styles = {
  formCard: {
    minHeight: "auto",
  },

  tableSection: {
    minHeight: "auto",
  },

  flexField: {
    flex: 1,
    minWidth: "220px",
  },

  primaryText: {
    fontWeight: "800",
    color: "#f8fafc",
  },
};