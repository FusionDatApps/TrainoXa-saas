"use client";

import { useEffect, useState } from "react";
import TrainerShell from "../../components/TrainerShell";
import { apiFetch } from "../../lib/api";

import PageContainer from "../../components/ui/PageContainer";
import SectionCard from "../../components/ui/SectionCard";
import StatCard from "../../components/ui/StatCard";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";
import ActionButton from "../../components/ui/ActionButton";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import StateRenderer from "../../components/ui/StateRenderer";

import { extractApiError } from "../../lib/form-helpers";
import { uiStyles } from "../../lib/ui-styles";

export const dynamic = "force-dynamic";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedExercises, setSelectedExercises] = useState({});
  const [workoutExercises, setWorkoutExercises] = useState({});

  const [addingExercise, setAddingExercise] = useState({});
  const [exerciseFeedback, setExerciseFeedback] = useState({});
  const [removingExercise, setRemovingExercise] = useState({});


  async function loadWorkoutExercises(workoutId) {
    try {
      const res = await apiFetch(`/workouts/${workoutId}/exercises`);

      setWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: res.data || [],
      }));
    } catch (err) {
      console.error("Error cargando ejercicios de rutina:", err.message);
    }
  }

  async function loadWorkouts() {
    try {
      const res = await apiFetch("/workouts");
      const data = res.data || [];

      setWorkouts(data);

      await Promise.all(
        data.map((workout) => loadWorkoutExercises(workout.id))
      );
    } catch (err) {
      console.error("Error cargando rutinas:", err.message);
      setError(err.message || "No se pudieron cargar las rutinas");
    } finally {
      setLoading(false);
    }
  }

  async function loadExercises() {
    try {
      const res = await apiFetch("/exercises");
      setExercises(res.data || []);
    } catch (err) {
      console.error("Error cargando ejercicios:", err.message);
    }
  }

  useEffect(() => {
    async function initialize() {
      await loadWorkouts();
      await loadExercises();
    }

    initialize();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch("/workouts", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      setName("");
      setDescription("");
      setSuccess("Rutina creada correctamente");

      await loadWorkouts();
    } catch (err) {
      setError(err.message || "No se pudo crear la rutina");
    } finally {
      setCreating(false);
    }
  }

  async function handleAddExercise(workoutId) {
  const form = selectedExercises[workoutId];

  if (!form || !form.exerciseId) {
    setExerciseFeedback((prev) => ({
      ...prev,
      [workoutId]: {
        type: "error",
        message: "Debes seleccionar un ejercicio",
      },
    }));

    return;
  }

  setAddingExercise((prev) => ({
    ...prev,
    [workoutId]: true,
  }));

  setExerciseFeedback((prev) => ({
    ...prev,
    [workoutId]: null,
  }));

  try {
    const currentItems = workoutExercises[workoutId] || [];

    const nextOrder = Number(
      form.exerciseOrder || currentItems.length + 1
    );

    await apiFetch(`/workouts/${workoutId}/exercises`, {
      method: "POST",
      body: JSON.stringify({
        exerciseId: form.exerciseId,
        exerciseOrder: nextOrder,
        sets: Number(form.sets || 4),
        reps: form.reps || "12",
        restSeconds: Number(form.restSeconds || 60),
        notes: form.notes || "",
      }),
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

    setExerciseFeedback((prev) => ({
      ...prev,
      [workoutId]: {
        type: "success",
        message: "Ejercicio agregado correctamente",
      },
    }));

    await loadWorkoutExercises(workoutId);
  } catch (err) {
    const message =
      err.message === "Este ejercicio ya fue agregado a la rutina"
        ? "Ese ejercicio ya existe dentro de la rutina"
        : err.message ===
          "Ya existe un ejercicio con ese orden dentro de la rutina"
        ? "Ese número de orden ya está ocupado"
        : err.message || "No se pudo agregar el ejercicio";

    setExerciseFeedback((prev) => ({
      ...prev,
      [workoutId]: {
        type: "error",
        message,
      },
    }));
  } finally {
    setAddingExercise((prev) => ({
      ...prev,
      [workoutId]: false,
    }));
  }
}

async function handleRemoveExercise(workoutId, itemId) {
  const confirmDelete = window.confirm(
    "¿Eliminar este ejercicio de la rutina?"
  );

  if (!confirmDelete) {
    return;
  }

  setRemovingExercise((prev) => ({
    ...prev,
    [itemId]: true,
  }));

  try {
    await apiFetch(`/workouts/${workoutId}/exercises/${itemId}`, {
      method: "DELETE",
    });

    setExerciseFeedback((prev) => ({
      ...prev,
      [workoutId]: {
        type: "success",
        message: "Ejercicio eliminado correctamente",
      },
    }));

    await loadWorkoutExercises(workoutId);
  } catch (err) {
    setExerciseFeedback((prev) => ({
      ...prev,
      [workoutId]: {
        type: "error",
        message:
          err.message ||
          "No se pudo eliminar el ejercicio de la rutina",
      },
    }));
  } finally {
    setRemovingExercise((prev) => ({
      ...prev,
      [itemId]: false,
    }));
  }
}
  return (
  <TrainerShell title="Rutinas" active="workouts">
    <PageContainer>
      <section style={styles.topGrid}>
  <SectionCard style={styles.createCard}>
    <PageHeader
      eyebrow="Workout builder"
      title="Crear rutina"
      description="Crea una rutina base y luego agrega ejercicios con orden, sets, reps y descanso."
    />

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
        label="Descripción"
        placeholder="Opcional"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        textarea
      />

      <ActionButton disabled={creating}>
        {creating
          ? "Creando..."
          : "Crear rutina"}
      </ActionButton>

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
    label="Rutinas totales"
    value={workouts.length}
    description="Rutinas registradas por el trainer."
  />
</section>

      <section style={styles.listSection}>
        <h2 style={styles.sectionTitle}>Lista de rutinas</h2>

        <StateRenderer
  loading={loading}
  error={error}
  isEmpty={
    !loading && workouts.length === 0
  }
  loadingMessage="Cargando rutinas..."
  emptyMessage="Todavía no tienes rutinas registradas."
>
          <SectionCard>
            <h3 style={styles.emptyTitle}>
              Todavía no tienes rutinas
            </h3>

            <EmptyState>
              Cuando crees rutinas en el sistema,
              aparecerán aquí.
            </EmptyState>
          </SectionCard>
        </StateRenderer>

{!loading && workouts.length > 0 ? (
          <div style={styles.workoutGrid}>
            {workouts.map((workout) => (
              <SectionCard key={workout.id}>
                <div style={styles.headerRow}>
                  <div>
                    <p style={styles.workoutTag}>Rutina</p>

                    <h3 style={styles.workoutName}>
                      {workout.name || "Sin nombre"}
                    </h3>
                  </div>

                  <Badge
                    variant={
                      workout.isActive
                        ? "success"
                        : "warning"
                    }
                  >
                    {workout.isActive
                      ? "Activa"
                      : "Inactiva"}
                  </Badge>
                </div>

                <div style={styles.infoGrid}>
                  <div>
                    <p style={styles.infoLabel}>Descripción</p>

                    <p style={styles.infoValue}>
                      {workout.description || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p style={styles.infoLabel}>ID</p>

                    <p style={styles.infoValue}>
                      {workout.id}
                    </p>
                  </div>
                </div>

                <hr style={styles.divider} />

                <h4 style={styles.subTitle}>
                  Agregar ejercicio
                </h4>

                <div style={styles.exerciseForm}>
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Ejercicio
                    </label>

                    <select
                      style={styles.select}
                      value={
                        selectedExercises[workout.id]
                          ?.exerciseId || ""
                      }
                      onChange={(e) =>
                        setSelectedExercises((prev) => ({
                          ...prev,
                          [workout.id]: {
                            ...prev[workout.id],
                            exerciseId: e.target.value,
                          },
                        }))
                      }
                    >
                      <option value="">
                        Selecciona ejercicio
                      </option>

                      {exercises.map((exercise) => (
                        <option
                          key={exercise.id}
                          value={exercise.id}
                        >
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.inlineGrid}>
                    <div style={styles.field}>
                      <label style={styles.label}>
                        Orden
                      </label>

                      <input
                        style={styles.smallInput}
                        type="number"
                        value={
                          selectedExercises[workout.id]
                            ?.exerciseOrder || 1
                        }
                        onChange={(e) =>
                          setSelectedExercises((prev) => ({
                            ...prev,
                            [workout.id]: {
                              ...prev[workout.id],
                              exerciseOrder: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Sets
                      </label>

                      <input
                        style={styles.smallInput}
                        type="number"
                        value={
                          selectedExercises[workout.id]
                            ?.sets || 4
                        }
                        onChange={(e) =>
                          setSelectedExercises((prev) => ({
                            ...prev,
                            [workout.id]: {
                              ...prev[workout.id],
                              sets: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Reps
                      </label>

                      <input
                        style={styles.smallInput}
                        type="text"
                        value={
                          selectedExercises[workout.id]
                            ?.reps || "12"
                        }
                        onChange={(e) =>
                          setSelectedExercises((prev) => ({
                            ...prev,
                            [workout.id]: {
                              ...prev[workout.id],
                              reps: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Descanso
                      </label>

                      <input
                        style={styles.smallInput}
                        type="number"
                        value={
                          selectedExercises[workout.id]
                            ?.restSeconds || 60
                        }
                        onChange={(e) =>
                          setSelectedExercises((prev) => ({
                            ...prev,
                            [workout.id]: {
                              ...prev[workout.id],
                              restSeconds:
                                e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>
                      Notas
                    </label>

                    <textarea
                      style={styles.notesInput}
                      placeholder="Indicaciones opcionales"
                      value={
                        selectedExercises[workout.id]
                          ?.notes || ""
                      }
                      onChange={(e) =>
                        setSelectedExercises((prev) => ({
                          ...prev,
                          [workout.id]: {
                            ...prev[workout.id],
                            notes: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <ActionButton
                    disabled={addingExercise[workout.id]}
                    onClick={() =>
                      handleAddExercise(workout.id)
                    }
                  >
                    {addingExercise[workout.id]
                      ? "Agregando ejercicio..."
                      : "Agregar ejercicio"}
                  </ActionButton>

                  {exerciseFeedback[workout.id] ? (
                    <p
                      style={
                        exerciseFeedback[workout.id]
                          .type === "error"
                          ? styles.error
                          : styles.success
                      }
                    >
                      {
                        exerciseFeedback[workout.id]
                          .message
                      }
                    </p>
                  ) : null}
                </div>

                <hr style={styles.divider} />

                <h4 style={styles.subTitle}>
                  Ejercicios asignados
                </h4>

                {!workoutExercises[workout.id] ||
                workoutExercises[workout.id].length ===
                  0 ? (
                  <EmptyState>
                    Esta rutina todavía no tiene
                    ejercicios.
                  </EmptyState>
                ) : (
                  <DataTable
                    columns={[
                      {
                        key: "order",
                        label: "#",
                        render: (row) =>
                          row.exerciseOrder,
                      },

                      {
                        key: "exercise",
                        label: "Ejercicio",
                        render: (row) =>
                          row.exercise?.name,
                      },

                      {
                        key: "sets",
                        label: "Sets/Reps",
                        render: (row) =>
                          `${row.sets} x ${row.reps}`,
                      },

                      {
                        key: "rest",
                        label: "Descanso",
                        render: (row) =>
                          `${row.restSeconds || 0}s`,
                      },

                      {
                        key: "actions",
                        label: "Acciones",
                        render: (row) => (
                          <ActionButton
                            variant="danger"
                            disabled={
                              removingExercise[
                                row.id
                              ]
                            }
                            onClick={() =>
                              handleRemoveExercise(
                                workout.id,
                                row.id
                              )
                            }
                          >
                            {removingExercise[row.id]
                              ? "Eliminando..."
                              : "Eliminar"}
                          </ActionButton>
                        ),
                      },
                    ]}
                    data={
                      workoutExercises[workout.id]
                    }
                  />
                )}
              </SectionCard>
            ))}
          </div>
        ) : null}
      </section>
    </PageContainer>
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

  textarea: {
    minHeight: "90px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    resize: "vertical",
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

  emptyTitle: {
    margin: "0 0 10px 0",
    fontSize: "20px",
    fontWeight: "800",
  },

  workoutGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "16px",
  },

  workoutCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "22px",
  },

  workoutTag: {
    margin: "0 0 10px 0",
    color: "#94a3b8",
    fontSize: "13px",
    textTransform: "uppercase",
  },

  workoutName: {
    margin: "0 0 16px 0",
    fontSize: "30px",
    fontWeight: "800",
  },

  workoutInfo: {
    margin: "0 0 10px 0",
    color: "#e2e8f0",
    lineHeight: 1.5,
  },

  divider: {
    border: "none",
    borderTop: "1px solid rgba(148, 163, 184, 0.14)",
    margin: "18px 0",
  },

  subTitle: {
    margin: "0 0 14px 0",
    fontSize: "16px",
    fontWeight: "800",
  },

  exerciseForm: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
  },

  smallInput: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
  },

  notesInput: {
    minHeight: "70px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    resize: "vertical",
  },

  addButton: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "#052e16",
    fontWeight: "800",
    cursor: "pointer",
  },

  removeButton: {
  marginBottom: "10px",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #7f1d1d",
  background: "#450a0a",
  color: "#fecaca",
  fontWeight: "700",
  fontSize: "13px",
  },

  exerciseList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  exerciseItem: {
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(2, 6, 23, 0.7)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },

  exerciseItemName: {
    margin: "0 0 6px 0",
    fontWeight: "800",
  },

  exerciseMeta: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },

  emptyExercises: {
    color: "#94a3b8",
    margin: 0,
  },

  topGrid: {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "16px",
  marginBottom: "32px",
},

createCard: {
  minHeight: "unset",
},

headerRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "18px",
},

infoGrid: {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "12px",
},

infoLabel: {
  margin: "0 0 4px 0",
  color: "#94a3b8",
  fontSize: "13px",
  fontWeight: "700",
},

infoValue: {
  margin: 0,
  color: "#f8fafc",
  wordBreak: "break-word",
},

inlineGrid: {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "12px",
},
};