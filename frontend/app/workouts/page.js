"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import TrainerShell from "../../components/TrainerShell";
import { apiFetch } from "../../lib/api";

import PageContainer from "../../components/ui/PageContainer";
import ActionButton from "../../components/ui/ActionButton";
import Badge from "../../components/ui/Badge";
import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import StateRenderer from "../../components/ui/StateRenderer";
import FormActions from "../../components/ui/FormActions";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Modal from "../../components/ui/Modal";
import Drawer from "../../components/ui/Drawer";
import { useToast } from "../../components/ui/ToastProvider";

import ContentStack from "../../components/ui/ContentStack";
import InlineGroup from "../../components/ui/InlineGroup";
import PageSection from "../../components/ui/PageSection";
import ResponsiveGrid from "../../components/ui/ResponsiveGrid";
import TableCard from "../../components/ui/TableCard";
import TableToolbar from "../../components/ui/TableToolbar";
import EmptySearchState from "../../components/ui/EmptySearchState";
import FilterPill from "../../components/ui/FilterPill";
import SkeletonCard from "../../components/ui/SkeletonCard";

import WorkoutSummaryCard from "../../components/workouts/WorkoutSummaryCard";
import WorkoutExerciseTable from "../../components/workouts/WorkoutExerciseTable";
import WorkoutAnalyticsCard from "../../components/workouts/WorkoutAnalyticsCard";
import WorkoutExerciseForm from "../../components/workouts/WorkoutExerciseForm";

import useMutation from "../../hooks/useMutation";
import useWorkoutExerciseManager from "../../hooks/useWorkoutExerciseManager";

import { uiStyles } from "../../lib/ui-styles";
import { theme } from "../../lib/theme";
import { getApiErrorMessage } from "../../lib/ui-feedback";
import { buildWorkoutMetrics } from "../../lib/workout-metrics";

export const dynamic = "force-dynamic";

export default function WorkoutsPage() {
  const toast = useToast();

  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  const {
    loading: creating,
    error,
    success,
    mutate: createWorkout,
    setSuccessMessage,
  } = useMutation(async (payload) => {
    return apiFetch("/workouts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  });

  const {
    selectedExercises,
    workoutExercises,
    setWorkoutExercises,
    addingExercise,
    updatingExercise,
    removingExercise,
    exerciseFeedback,
    pendingRemoveExercise,
    setPendingRemoveExercise,
    loadWorkoutExercises,
    updateWorkoutExerciseForm,
    handleAddExercise,
    handleUpdateExercise,
    handleMoveExercise,
    requestRemoveExercise,
    confirmRemoveExercise,
  } = useWorkoutExerciseManager({
    exercises,
    toast,
  });

  const analytics = useMemo(() => {
    return buildWorkoutMetrics({
      workouts,
      workoutExercises,
    });
  }, [workouts, workoutExercises]);

  const selectedWorkout = useMemo(() => {
    return workouts.find(
      (workout) => workout.id === selectedWorkoutId
    ) || null;
  }, [workouts, selectedWorkoutId]);

  const filteredWorkouts = useMemo(() => {
    let result = [...workouts];

    if (search.trim()) {
      const term = search.toLowerCase();

      result = result.filter(
        (workout) =>
          workout.name?.toLowerCase().includes(term) ||
          workout.description?.toLowerCase().includes(term)
      );
    }

    if (filter === "active") {
      result = result.filter((workout) => workout.isActive);
    }

    if (filter === "inactive") {
      result = result.filter((workout) => !workout.isActive);
    }

    return result;
  }, [workouts, search, filter]);

  const selectedAssignedExercises = selectedWorkout
    ? workoutExercises[selectedWorkout.id] || []
    : [];

  const selectedExerciseForm = selectedWorkout
    ? selectedExercises[selectedWorkout.id] || {}
    : {};

  const loadWorkouts = useCallback(async () => {
    try {
      const res = await apiFetch("/workouts");

      const data = res.data || [];

      setWorkouts(data);

      await Promise.all(
        data.map((workout) =>
          loadWorkoutExercises(workout.id)
        )
      );
    } catch (err) {
      console.error(
        "Error cargando rutinas:",
        err.message
      );
    } finally {
      setLoading(false);
    }
  }, [loadWorkoutExercises]);

  const loadExercises = useCallback(async () => {
    try {
      const res = await apiFetch("/exercises");

      setExercises(res.data || []);
    } catch (err) {
      console.error(
        "Error cargando ejercicios:",
        err.message
      );
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      await loadWorkouts();
      await loadExercises();
    }

    initialize();
  }, [loadExercises, loadWorkouts]);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.warning({
        title: "Nombre requerido",
        message:
          "Debes escribir el nombre de la rutina.",
      });

      return;
    }

    const tempId = `temp-workout-${Date.now()}`;

    const optimisticWorkout = {
      id: tempId,
      name: trimmedName,
      description: trimmedDescription || "",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      optimistic: true,
    };

    setWorkouts((prev) => [
      optimisticWorkout,
      ...prev,
    ]);

    setWorkoutExercises((prev) => ({
      ...prev,
      [tempId]: [],
    }));

    setName("");
    setDescription("");
    setIsCreateModalOpen(false);

    try {
      const res = await createWorkout({
        name: trimmedName,
        description:
          trimmedDescription || undefined,
      });

      const createdWorkout = res?.data;

      if (createdWorkout?.id) {
        setWorkouts((prev) =>
          prev.map((workout) =>
            workout.id === tempId
              ? {
                  ...createdWorkout,
                  optimistic: false,
                }
              : workout
          )
        );

        setWorkoutExercises((prev) => {
          const {
            [tempId]: tempItems,
            ...rest
          } = prev;

          return {
            ...rest,
            [createdWorkout.id]:
              tempItems || [],
          };
        });
      } else {
        await loadWorkouts();
      }

      setSuccessMessage(
        "Rutina creada correctamente"
      );

      toast.success({
        title: "Rutina creada",
        message:
          "La rutina fue creada correctamente.",
      });
    } catch (err) {
      setWorkouts((prev) =>
        prev.filter(
          (workout) => workout.id !== tempId
        )
      );

      setWorkoutExercises((prev) => {
        const {
          [tempId]: _removed,
          ...rest
        } = prev;

        return rest;
      });

      toast.error({
        title: "No se pudo crear la rutina",
        message: getApiErrorMessage(err),
      });
    }
  }

  function openWorkoutDrawer(workoutId) {
    setSelectedWorkoutId(workoutId);
  }

  function closeWorkoutDrawer() {
    setSelectedWorkoutId(null);
  }

  return (
    <TrainerShell
      title="Rutinas"
      active="workouts"
    >
      <PageContainer>
        <ContentStack gap={24}>
          <PageSection>
            <ContentStack gap={20}>
              <InlineGroup
                justify="space-between"
                align="center"
              >
                <PageHeader
                  eyebrow="Workout builder"
                  title="Workspace de rutinas"
                  description="Administra rutinas, ejercicios y analitica operacional."
                />

                <ActionButton
                  onClick={() =>
                    setIsCreateModalOpen(true)
                  }
                >
                  Nueva rutina
                </ActionButton>
              </InlineGroup>

              {loading ? (
                <ResponsiveGrid
                  min={220}
                  gap={16}
                >
                  <SkeletonCard
                    compact
                    height={140}
                  />
                  <SkeletonCard
                    compact
                    height={140}
                  />
                  <SkeletonCard
                    compact
                    height={140}
                  />
                  <SkeletonCard
                    compact
                    height={140}
                  />
                </ResponsiveGrid>
              ) : (
                <ResponsiveGrid
                  min={240}
                  gap={16}
                >
                  <WorkoutAnalyticsCard
                    title="Rutinas totales"
                    value={
                      analytics.totalWorkouts
                    }
                    trend={`${analytics.activeWorkouts} activas`}
                    description="Cantidad total de rutinas registradas en el sistema."
                    accent="#3b82f6"
                  />

                  <WorkoutAnalyticsCard
                    title="Ejercicios asignados"
                    value={
                      analytics.totalExercises
                    }
                    trend="Carga operacional"
                    description="Ejercicios distribuidos dentro de todas las rutinas."
                    accent="#8b5cf6"
                  />

                  <WorkoutAnalyticsCard
                    title="Promedio ejercicios"
                    value={
                      analytics.averageExercisesPerWorkout
                    }
                    trend="Por rutina"
                    description="Promedio de ejercicios configurados por rutina."
                    accent="#22c55e"
                  />

                  <WorkoutAnalyticsCard
                    title="Rutina dominante"
                    value={
                      analytics
                        .mostLoadedWorkout.count
                    }
                    trend={
                      analytics
                        .mostLoadedWorkout.name
                    }
                    description="Rutina con mayor cantidad de ejercicios asignados."
                    accent="#f59e0b"
                  />
                </ResponsiveGrid>
              )}
            </ContentStack>
          </PageSection>

          <PageSection>
            <TableCard
              toolbar={
                <TableToolbar
                  title="Workspace operacional"
                  description="Busca, filtra y administra rutinas con sus ejercicios asociados."
                  searchValue={search}
                  onSearchChange={(e) =>
                    setSearch(e.target.value)
                  }
                  searchPlaceholder="Buscar rutina o descripcion..."
                >
                  <InlineGroup gap={10}>
                    <FilterPill
                      active={filter === "all"}
                      onClick={() =>
                        setFilter("all")
                      }
                    >
                      Todas
                    </FilterPill>

                    <FilterPill
                      active={
                        filter === "active"
                      }
                      onClick={() =>
                        setFilter("active")
                      }
                    >
                      Activas
                    </FilterPill>

                    <FilterPill
                      active={
                        filter === "inactive"
                      }
                      onClick={() =>
                        setFilter("inactive")
                      }
                    >
                      Inactivas
                    </FilterPill>
                  </InlineGroup>
                </TableToolbar>
              }
            >
              <ContentStack gap={24}>
                <InlineGroup justify="space-between">
                  <p style={styles.sectionEyebrow}>
                    Builder operacional
                  </p>

                  <Badge variant="default">
                    {filteredWorkouts.length}{" "}
                    rutinas
                  </Badge>
                </InlineGroup>

                <StateRenderer
                  loading={loading}
                  error={error}
                  isEmpty={
                    !loading &&
                    workouts.length === 0
                  }
                  loadingVariant="grid"
                  skeletonCount={6}
                  skeletonHeight={260}
                  emptyMessage="Todavia no tienes rutinas registradas."
                >
                  {workouts.length > 0 &&
                  filteredWorkouts.length ===
                    0 ? (
                    <EmptySearchState />
                  ) : (
                    <ResponsiveGrid
                      min={340}
                      gap={18}
                    >
                      {filteredWorkouts.map(
                        (workout) => {
                          const assignedExercises =
                            workoutExercises[
                              workout.id
                            ] || [];

                          return (
                            <WorkoutSummaryCard
                              key={workout.id}
                              workout={workout}
                              assignedExercises={
                                assignedExercises
                              }
                              onManage={() =>
                                openWorkoutDrawer(
                                  workout.id
                                )
                              }
                            />
                          );
                        }
                      )}
                    </ResponsiveGrid>
                  )}
                </StateRenderer>
              </ContentStack>
            </TableCard>
          </PageSection>
        </ContentStack>
      </PageContainer>

      <Modal
        open={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
        title="Crear rutina"
        description="Crea una nueva rutina operacional para tus clientes."
        size="md"
      >
        <form
          onSubmit={handleSubmit}
          style={uiStyles.stack}
        >
          <FormField
            label="Nombre de la rutina"
            placeholder="Ej: Push Pull Legs"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <FormField
            label="Descripcion"
            placeholder="Opcional"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            textarea
          />

          <FormActions
            loading={creating}
            submitText="Crear rutina"
          />

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
      </Modal>

      <Drawer
        open={Boolean(selectedWorkout)}
        onClose={closeWorkoutDrawer}
        title={
          selectedWorkout?.name ||
          "Gestionar rutina"
        }
        description={
          selectedWorkout?.description ||
          "Administra los ejercicios asignados a esta rutina."
        }
        width={720}
      >
        {selectedWorkout ? (
          <ContentStack gap={24}>
            <ResponsiveGrid
              min={160}
              gap={12}
            >
              <div style={styles.infoBox}>
                <p style={styles.infoLabel}>
                  Ejercicios
                </p>

                <p style={styles.infoValue}>
                  {
                    selectedAssignedExercises.length
                  }
                </p>
              </div>

              <div style={styles.infoBox}>
                <p style={styles.infoLabel}>
                  Estado
                </p>

                <p style={styles.infoValue}>
                  {selectedWorkout.isActive
                    ? "Disponible"
                    : "Pausada"}
                </p>
              </div>
            </ResponsiveGrid>

            <div style={styles.divider} />

            <WorkoutExerciseForm
              workoutId={selectedWorkout.id}
              exercises={exercises}
              form={selectedExerciseForm}
              loading={
                addingExercise[
                  selectedWorkout.id
                ]
              }
              feedback={
                exerciseFeedback[
                  selectedWorkout.id
                ]
              }
              onChange={
                updateWorkoutExerciseForm
              }
              onSubmit={handleAddExercise}
            />

            <div style={styles.divider} />

            <WorkoutExerciseTable
              workoutId={selectedWorkout.id}
              assignedExercises={
                selectedAssignedExercises
              }
              removingExercise={
                removingExercise
              }
              updatingExercise={
                updatingExercise
              }
              onRequestRemove={
                requestRemoveExercise
              }
              onUpdateExercise={
                handleUpdateExercise
              }
              onMoveExercise={
                handleMoveExercise
              }
            />
          </ContentStack>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={Boolean(
          pendingRemoveExercise
        )}
        title="Eliminar ejercicio"
        description="Esta accion eliminara el ejercicio seleccionado de la rutina. Verifica antes de continuar."
        confirmText="Eliminar ejercicio"
        cancelText="Cancelar"
        loading={
          pendingRemoveExercise
            ? Boolean(
                removingExercise[
                  pendingRemoveExercise
                    .itemId
                ]
              )
            : false
        }
        onCancel={() =>
          setPendingRemoveExercise(null)
        }
        onConfirm={confirmRemoveExercise}
      />
    </TrainerShell>
  );
}

const styles = {
  sectionEyebrow: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  infoBox: {
    padding: "14px",
    borderRadius: theme.radius.sm,
    background:
      "rgba(15, 23, 42, 0.72)",
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

  divider: {
    height: "1px",
    background: theme.colors.border,
    width: "100%",
  },
};