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
import SectionCard from "../../components/ui/SectionCard";
import StatCard from "../../components/ui/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import ActionButton from "../../components/ui/ActionButton";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import StateRenderer from "../../components/ui/StateRenderer";
import FormActions from "../../components/ui/FormActions";
import AsyncButton from "../../components/ui/AsyncButton";
import SelectField from "../../components/ui/SelectField";
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

import useMutation from "../../hooks/useMutation";
import useItemFeedback from "../../hooks/useItemFeedback";

import { uiStyles } from "../../lib/ui-styles";
import { theme } from "../../lib/theme";
import { getApiErrorMessage } from "../../lib/ui-feedback";

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

  const [selectedExercises, setSelectedExercises] = useState({});
  const [workoutExercises, setWorkoutExercises] = useState({});
  const [addingExercise, setAddingExercise] = useState({});
  const [removingExercise, setRemovingExercise] = useState({});
  const [exerciseFeedback, setExerciseFeedback] = useState({});
  const [pendingRemoveExercise, setPendingRemoveExercise] = useState(null);
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

  const { mutate: addWorkoutExercise } =
    useMutation(async ({ workoutId, payload }) => {
      return apiFetch(`/workouts/${workoutId}/exercises`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    });

  const { mutate: removeWorkoutExercise } =
    useMutation(async ({ workoutId, itemId }) => {
      return apiFetch(`/workouts/${workoutId}/exercises/${itemId}`, {
        method: "DELETE",
      });
    });

  const {
    setSuccess,
    setError,
    clearFeedback,
  } = useItemFeedback();

  const activeWorkouts = useMemo(
    () => workouts.filter((workout) => workout.isActive),
    [workouts]
  );

  const inactiveWorkouts = useMemo(
    () => workouts.filter((workout) => !workout.isActive),
    [workouts]
  );

  const selectedWorkout = useMemo(() => {
    return workouts.find((workout) => workout.id === selectedWorkoutId) || null;
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

  const totalWorkoutExercises = useMemo(() => {
    return Object.values(workoutExercises).reduce(
      (total, items) => total + (items?.length || 0),
      0
    );
  }, [workoutExercises]);

  const selectedAssignedExercises = selectedWorkout
    ? workoutExercises[selectedWorkout.id] || []
    : [];

  const selectedExerciseForm = selectedWorkout
    ? selectedExercises[selectedWorkout.id] || {}
    : {};

  const setWorkoutFeedback = useCallback((workoutId, type, message) => {
    setExerciseFeedback((prev) => ({
      ...prev,
      [workoutId]: {
        type,
        message,
      },
    }));
  }, []);

  const loadWorkoutExercises = useCallback(async (workoutId) => {
    try {
      const res = await apiFetch(`/workouts/${workoutId}/exercises`);

      setWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: res.data || [],
      }));
    } catch (err) {
      console.error("Error cargando ejercicios de rutina:", err.message);
    }
  }, []);

  const loadWorkouts = useCallback(async () => {
    try {
      const res = await apiFetch("/workouts");

      const data = res.data || [];

      setWorkouts(data);

      await Promise.all(
        data.map((workout) => loadWorkoutExercises(workout.id))
      );
    } catch (err) {
      console.error("Error cargando rutinas:", err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loadWorkoutExercises]);

  const loadExercises = useCallback(async () => {
    try {
      const res = await apiFetch("/exercises");

      setExercises(res.data || []);
    } catch (err) {
      console.error("Error cargando ejercicios:", err.message);
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

    try {
      await createWorkout({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      setName("");
      setDescription("");
      setIsCreateModalOpen(false);

      setSuccessMessage("Rutina creada correctamente");

      toast.success({
        title: "Rutina creada",
        message: "La rutina fue creada correctamente.",
      });

      await loadWorkouts();
    } catch (err) {
      toast.error({
        title: "No se pudo crear la rutina",
        message: getApiErrorMessage(err),
      });
    }
  }

  async function handleAddExercise(workoutId) {
    const form = selectedExercises[workoutId];

    if (!form || !form.exerciseId) {
      setWorkoutFeedback(workoutId, "error", "Debes seleccionar un ejercicio");

      toast.warning({
        title: "Selecciona un ejercicio",
        message: "Debes elegir un ejercicio antes de agregarlo.",
      });

      return;
    }

    setAddingExercise((prev) => ({
      ...prev,
      [workoutId]: true,
    }));

    clearFeedback();

    try {
      const currentItems = workoutExercises[workoutId] || [];
      const nextOrder = Number(form.exerciseOrder || currentItems.length + 1);

      await addWorkoutExercise({
        workoutId,
        payload: {
          exerciseId: form.exerciseId,
          exerciseOrder: nextOrder,
          sets: Number(form.sets || 4),
          reps: form.reps || "12",
          restSeconds: Number(form.restSeconds || 60),
          notes: form.notes || "",
        },
      });

      setSelectedExercises((prev) => ({
        ...prev,
        [workoutId]: {
          exerciseId: "",
          exerciseOrder: currentItems.length + 2,
          sets: 4,
          reps: "12",
          restSeconds: 60,
          notes: "",
        },
      }));

      setSuccess("Ejercicio agregado correctamente");
      setWorkoutFeedback(workoutId, "success", "Ejercicio agregado correctamente");

      toast.success({
        title: "Ejercicio agregado",
        message: "El ejercicio fue agregado correctamente a la rutina.",
      });

      await loadWorkoutExercises(workoutId);
    } catch (err) {
      const message =
        err.message === "Este ejercicio ya fue agregado a la rutina"
          ? "Ese ejercicio ya existe dentro de la rutina"
          : err.message === "Ya existe un ejercicio con ese orden dentro de la rutina"
            ? "Ese numero de orden ya esta ocupado"
            : err.message || "No se pudo agregar el ejercicio";

      setError(message);
      setWorkoutFeedback(workoutId, "error", message);

      toast.error({
        title: "No se pudo agregar",
        message,
      });
    } finally {
      setAddingExercise((prev) => ({
        ...prev,
        [workoutId]: false,
      }));
    }
  }

  function requestRemoveExercise(workoutId, itemId) {
    setPendingRemoveExercise({
      workoutId,
      itemId,
    });
  }

  async function confirmRemoveExercise() {
    if (!pendingRemoveExercise) {
      return;
    }

    const { workoutId, itemId } = pendingRemoveExercise;

    setRemovingExercise((prev) => ({
      ...prev,
      [itemId]: true,
    }));

    try {
      await removeWorkoutExercise({
        workoutId,
        itemId,
      });

      setSuccess("Ejercicio eliminado correctamente");
      setWorkoutFeedback(workoutId, "success", "Ejercicio eliminado correctamente");

      toast.success({
        title: "Ejercicio eliminado",
        message: "El ejercicio fue eliminado correctamente de la rutina.",
      });

      setPendingRemoveExercise(null);

      await loadWorkoutExercises(workoutId);
    } catch (err) {
      const message =
        err.message || "No se pudo eliminar el ejercicio de la rutina";

      setError(message);
      setWorkoutFeedback(workoutId, "error", message);

      toast.error({
        title: "No se pudo eliminar",
        message,
      });
    } finally {
      setRemovingExercise((prev) => ({
        ...prev,
        [itemId]: false,
      }));
    }
  }

  function updateWorkoutExerciseForm(workoutId, key, value) {
    setSelectedExercises((prev) => ({
      ...prev,
      [workoutId]: {
        ...prev[workoutId],
        [key]: value,
      },
    }));
  }

  function openWorkoutDrawer(workoutId) {
    setSelectedWorkoutId(workoutId);
  }

  function closeWorkoutDrawer() {
    setSelectedWorkoutId(null);
  }

  function buildExerciseColumns(workoutId) {
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
          <span style={styles.exerciseName}>
            {row.exercise?.name || "Sin nombre"}
          </span>
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
            disabled={removingExercise[row.id]}
            onClick={() => requestRemoveExercise(workoutId, row.id)}
          >
            {removingExercise[row.id] ? "Eliminando..." : "Eliminar"}
          </ActionButton>
        ),
      },
    ];
  }

  return (
    <TrainerShell title="Rutinas" active="workouts">
      <PageContainer>
        <ContentStack gap={24}>
          <PageSection>
            <ContentStack gap={20}>
              <InlineGroup justify="space-between" align="center">
                <PageHeader
                  eyebrow="Workout builder"
                  title="Workspace de rutinas"
                  description="Administra rutinas, ejercicios y configuraciones operacionales."
                />

                <ActionButton onClick={() => setIsCreateModalOpen(true)}>
                  Nueva rutina
                </ActionButton>
              </InlineGroup>

              {loading ? (
                <ResponsiveGrid min={220} gap={16}>
                  <SkeletonCard compact height={120} />
                  <SkeletonCard compact height={120} />
                  <SkeletonCard compact height={120} />
                  <SkeletonCard compact height={120} />
                </ResponsiveGrid>
              ) : (
                <ResponsiveGrid min={220} gap={16}>
                  <StatCard
                    label="Rutinas"
                    value={workouts.length}
                    description="Rutinas registradas por el trainer."
                  />

                  <StatCard
                    label="Activas"
                    value={activeWorkouts.length}
                    description="Rutinas disponibles para asignacion."
                  />

                  <StatCard
                    label="Inactivas"
                    value={inactiveWorkouts.length}
                    description="Rutinas pausadas o no disponibles."
                  />

                  <StatCard
                    label="Ejercicios asignados"
                    value={totalWorkoutExercises}
                    description="Ejercicios distribuidos en rutinas."
                  />
                </ResponsiveGrid>
              )}
            </ContentStack>
          </PageSection>

          <PageSection>
            <TableCard
              toolbar={
                <TableToolbar
                  title="Workspace de rutinas"
                  description="Busca, filtra y administra rutinas con sus ejercicios asociados."
                  searchValue={search}
                  onSearchChange={(e) => setSearch(e.target.value)}
                  searchPlaceholder="Buscar rutina o descripcion..."
                >
                  <InlineGroup gap={10}>
                    <FilterPill
                      active={filter === "all"}
                      onClick={() => setFilter("all")}
                    >
                      Todas
                    </FilterPill>

                    <FilterPill
                      active={filter === "active"}
                      onClick={() => setFilter("active")}
                    >
                      Activas
                    </FilterPill>

                    <FilterPill
                      active={filter === "inactive"}
                      onClick={() => setFilter("inactive")}
                    >
                      Inactivas
                    </FilterPill>
                  </InlineGroup>
                </TableToolbar>
              }
            >
              <ContentStack gap={24}>
                <InlineGroup justify="space-between">
                  <p style={styles.sectionEyebrow}>Builder operacional</p>

                  <Badge variant="default">
                    {filteredWorkouts.length} rutinas
                  </Badge>
                </InlineGroup>

                <StateRenderer
                  loading={loading}
                  error={error}
                  isEmpty={!loading && workouts.length === 0}
                  loadingVariant="grid"
                  skeletonCount={6}
                  skeletonHeight={260}
                  emptyMessage="Todavia no tienes rutinas registradas."
                >
                  {workouts.length > 0 && filteredWorkouts.length === 0 ? (
                    <EmptySearchState />
                  ) : (
                    <ResponsiveGrid min={340} gap={18}>
                      {filteredWorkouts.map((workout) => {
                        const assignedExercises =
                          workoutExercises[workout.id] || [];

                        return (
                          <SectionCard key={workout.id}>
                            <ContentStack gap={20}>
                              <InlineGroup
                                justify="space-between"
                                align="flex-start"
                              >
                                <div>
                                  <p style={styles.workoutTag}>Rutina</p>

                                  <h3 style={styles.workoutName}>
                                    {workout.name || "Sin nombre"}
                                  </h3>

                                  <p style={styles.workoutDescription}>
                                    {workout.description || "Sin descripcion"}
                                  </p>
                                </div>

                                <Badge
                                  variant={
                                    workout.isActive ? "success" : "warning"
                                  }
                                >
                                  {workout.isActive ? "Activa" : "Inactiva"}
                                </Badge>
                              </InlineGroup>

                              <ResponsiveGrid min={160} gap={12}>
                                <div style={styles.infoBox}>
                                  <p style={styles.infoLabel}>Ejercicios</p>

                                  <p style={styles.infoValue}>
                                    {assignedExercises.length}
                                  </p>
                                </div>

                                <div style={styles.infoBox}>
                                  <p style={styles.infoLabel}>Estado</p>

                                  <p style={styles.infoValue}>
                                    {workout.isActive
                                      ? "Disponible"
                                      : "Pausada"}
                                  </p>
                                </div>
                              </ResponsiveGrid>

                              <ActionButton
                                onClick={() => openWorkoutDrawer(workout.id)}
                              >
                                Gestionar rutina
                              </ActionButton>
                            </ContentStack>
                          </SectionCard>
                        );
                      })}
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
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear rutina"
        description="Crea una nueva rutina operacional para tus clientes."
        size="md"
      >
        <form onSubmit={handleSubmit} style={uiStyles.stack}>
          <FormField
            label="Nombre de la rutina"
            placeholder="Ej: Push Pull Legs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormField
            label="Descripcion"
            placeholder="Opcional"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            textarea
          />

          <FormActions loading={creating} submitText="Crear rutina" />

          {error ? (
            <FeedbackMessage variant="error">{error}</FeedbackMessage>
          ) : null}

          {success ? (
            <FeedbackMessage variant="success">{success}</FeedbackMessage>
          ) : null}
        </form>
      </Modal>

      <Drawer
        open={Boolean(selectedWorkout)}
        onClose={closeWorkoutDrawer}
        title={selectedWorkout?.name || "Gestionar rutina"}
        description={selectedWorkout?.description || "Administra los ejercicios asignados a esta rutina."}
        width={720}
      >
        {selectedWorkout ? (
          <ContentStack gap={24}>
            <ResponsiveGrid min={160} gap={12}>
              <div style={styles.infoBox}>
                <p style={styles.infoLabel}>Ejercicios</p>

                <p style={styles.infoValue}>
                  {selectedAssignedExercises.length}
                </p>
              </div>

              <div style={styles.infoBox}>
                <p style={styles.infoLabel}>Estado</p>

                <p style={styles.infoValue}>
                  {selectedWorkout.isActive ? "Disponible" : "Pausada"}
                </p>
              </div>
            </ResponsiveGrid>

            <div style={styles.divider} />

            <ContentStack gap={14}>
              <h4 style={styles.subTitle}>Agregar ejercicio</h4>

              <SelectField
                label="Ejercicio"
                value={selectedExerciseForm.exerciseId || ""}
                onChange={(e) =>
                  updateWorkoutExerciseForm(
                    selectedWorkout.id,
                    "exerciseId",
                    e.target.value
                  )
                }
              >
                <option value="">Selecciona ejercicio</option>

                {exercises.map((exercise) => (
                  <option
                    key={exercise.id}
                    value={exercise.id}
                  >
                    {exercise.name}
                  </option>
                ))}
              </SelectField>

              <ResponsiveGrid min={120} gap={12}>
                <div style={styles.field}>
                  <label style={styles.label}>Orden</label>

                  <input
                    style={styles.smallInput}
                    type="number"
                    value={selectedExerciseForm.exerciseOrder || 1}
                    onChange={(e) =>
                      updateWorkoutExerciseForm(
                        selectedWorkout.id,
                        "exerciseOrder",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Sets</label>

                  <input
                    style={styles.smallInput}
                    type="number"
                    value={selectedExerciseForm.sets || 4}
                    onChange={(e) =>
                      updateWorkoutExerciseForm(
                        selectedWorkout.id,
                        "sets",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Reps</label>

                  <input
                    style={styles.smallInput}
                    type="text"
                    value={selectedExerciseForm.reps || "12"}
                    onChange={(e) =>
                      updateWorkoutExerciseForm(
                        selectedWorkout.id,
                        "reps",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Descanso</label>

                  <input
                    style={styles.smallInput}
                    type="number"
                    value={selectedExerciseForm.restSeconds || 60}
                    onChange={(e) =>
                      updateWorkoutExerciseForm(
                        selectedWorkout.id,
                        "restSeconds",
                        e.target.value
                      )
                    }
                  />
                </div>
              </ResponsiveGrid>

              <div style={styles.field}>
                <label style={styles.label}>Notas</label>

                <textarea
                  style={styles.notesInput}
                  placeholder="Indicaciones opcionales"
                  value={selectedExerciseForm.notes || ""}
                  onChange={(e) =>
                    updateWorkoutExerciseForm(
                      selectedWorkout.id,
                      "notes",
                      e.target.value
                    )
                  }
                />
              </div>

              <AsyncButton
                loading={addingExercise[selectedWorkout.id]}
                loadingText="Agregando ejercicio..."
                onClick={() => handleAddExercise(selectedWorkout.id)}
              >
                Agregar ejercicio
              </AsyncButton>

              {exerciseFeedback[selectedWorkout.id] ? (
                <p
                  style={
                    exerciseFeedback[selectedWorkout.id].type === "error"
                      ? styles.error
                      : styles.success
                  }
                >
                  {exerciseFeedback[selectedWorkout.id].message}
                </p>
              ) : null}
            </ContentStack>

            <div style={styles.divider} />

            <ContentStack gap={14}>
              <InlineGroup justify="space-between">
                <h4 style={styles.subTitle}>Ejercicios asignados</h4>

                <Badge variant="default">
                  {selectedAssignedExercises.length} items
                </Badge>
              </InlineGroup>

              {selectedAssignedExercises.length === 0 ? (
                <EmptyState>
                  Esta rutina todavia no tiene ejercicios.
                </EmptyState>
              ) : (
                <DataTable
                  columns={buildExerciseColumns(selectedWorkout.id)}
                  data={selectedAssignedExercises}
                  emptyMessage="No hay ejercicios asignados"
                />
              )}
            </ContentStack>
          </ContentStack>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingRemoveExercise)}
        title="Eliminar ejercicio"
        description="Esta accion eliminara el ejercicio seleccionado de la rutina. Verifica antes de continuar."
        confirmText="Eliminar ejercicio"
        cancelText="Cancelar"
        loading={
          pendingRemoveExercise
            ? Boolean(removingExercise[pendingRemoveExercise.itemId])
            : false
        }
        onCancel={() => setPendingRemoveExercise(null)}
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

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#cbd5e1",
  },

  smallInput: {
    padding: "12px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    color: theme.colors.textPrimary,
  },

  notesInput: {
    minHeight: "70px",
    padding: "12px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    color: theme.colors.textPrimary,
    resize: "vertical",
  },

  error: {
    margin: 0,
    color: theme.colors.danger,
    fontSize: "14px",
  },

  success: {
    margin: 0,
    color: theme.colors.success,
    fontSize: "14px",
  },

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

  divider: {
    height: "1px",
    background: theme.colors.border,
    width: "100%",
  },

  subTitle: {
    margin: 0,
    color: theme.colors.textPrimary,
    fontSize: "16px",
    fontWeight: "900",
  },

  exerciseName: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },
};
