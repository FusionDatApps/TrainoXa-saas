"use client";

import {
  useCallback,
  useEffect,
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

import useMutation from "../../hooks/useMutation";
import useItemFeedback from "../../hooks/useItemFeedback";

import { uiStyles } from "../../lib/ui-styles";
import { layoutStyles } from "../../lib/layout-styles";

export const dynamic = "force-dynamic";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
      return apiFetch(
        `/workouts/${workoutId}/exercises`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
    });

  const { mutate: removeWorkoutExercise } =
    useMutation(async ({ workoutId, itemId }) => {
      return apiFetch(
        `/workouts/${workoutId}/exercises/${itemId}`,
        {
          method: "DELETE",
        }
      );
    });

  const [selectedExercises, setSelectedExercises] =
    useState({});

  const [workoutExercises, setWorkoutExercises] =
    useState({});

  const [addingExercise, setAddingExercise] =
    useState({});

  const [removingExercise, setRemovingExercise] =
    useState({});

  const [exerciseFeedback, setExerciseFeedback] =
    useState({});

  const {
    setSuccess,
    setError,
    clearFeedback,
  } = useItemFeedback();

  const setWorkoutFeedback = useCallback(
    (workoutId, type, message) => {
      setExerciseFeedback((prev) => ({
        ...prev,
        [workoutId]: {
          type,
          message,
        },
      }));
    },
    []
  );

  const loadWorkoutExercises = useCallback(
    async (workoutId) => {
      try {
        const res = await apiFetch(
          `/workouts/${workoutId}/exercises`
        );

        setWorkoutExercises((prev) => ({
          ...prev,
          [workoutId]: res.data || [],
        }));
      } catch (err) {
        console.error(
          "Error cargando ejercicios de rutina:",
          err.message
        );
      }
    },
    []
  );

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

    await createWorkout({
      name: name.trim(),

      description:
        description.trim() || undefined,
    });

    setName("");
    setDescription("");

    setSuccessMessage(
      "Rutina creada correctamente"
    );

    await loadWorkouts();
  }

  async function handleAddExercise(workoutId) {
    const form = selectedExercises[workoutId];

    if (!form || !form.exerciseId) {
      setWorkoutFeedback(
        workoutId,
        "error",
        "Debes seleccionar un ejercicio"
      );

      return;
    }

    setAddingExercise((prev) => ({
      ...prev,
      [workoutId]: true,
    }));

    clearFeedback();

    try {
      const currentItems =
        workoutExercises[workoutId] || [];

      const nextOrder = Number(
        form.exerciseOrder ||
          currentItems.length + 1
      );

      await addWorkoutExercise({
        workoutId,

        payload: {
          exerciseId: form.exerciseId,

          exerciseOrder: nextOrder,

          sets: Number(form.sets || 4),

          reps: form.reps || "12",

          restSeconds: Number(
            form.restSeconds || 60
          ),

          notes: form.notes || "",
        },
      });

      setSelectedExercises((prev) => ({
        ...prev,

        [workoutId]: {
          exerciseId: "",

          exerciseOrder:
            currentItems.length + 2,

          sets: 4,

          reps: "12",

          restSeconds: 60,

          notes: "",
        },
      }));

      setSuccess(
        "Ejercicio agregado correctamente"
      );

      setWorkoutFeedback(
        workoutId,
        "success",
        "Ejercicio agregado correctamente"
      );

      await loadWorkoutExercises(workoutId);
    } catch (err) {
      const message =
        err.message ===
        "Este ejercicio ya fue agregado a la rutina"
          ? "Ese ejercicio ya existe dentro de la rutina"
          : err.message ===
              "Ya existe un ejercicio con ese orden dentro de la rutina"
            ? "Ese número de orden ya está ocupado"
            : err.message ||
              "No se pudo agregar el ejercicio";

      setError(message);

      setWorkoutFeedback(
        workoutId,
        "error",
        message
      );
    } finally {
      setAddingExercise((prev) => ({
        ...prev,
        [workoutId]: false,
      }));
    }
  }

  async function handleRemoveExercise(
    workoutId,
    itemId
  ) {
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
      await removeWorkoutExercise({
        workoutId,
        itemId,
      });

      setSuccess(
        "Ejercicio eliminado correctamente"
      );

      setWorkoutFeedback(
        workoutId,
        "success",
        "Ejercicio eliminado correctamente"
      );

      await loadWorkoutExercises(workoutId);
    } catch (err) {
      const message =
        err.message ||
        "No se pudo eliminar el ejercicio de la rutina";

      setError(message);

      setWorkoutFeedback(
        workoutId,
        "error",
        message
      );
    } finally {
      setRemovingExercise((prev) => ({
        ...prev,
        [itemId]: false,
      }));
    }
  }

  return (
    <TrainerShell
      title="Rutinas"
      active="workouts"
    >
      <PageContainer>
        <section style={layoutStyles.topGrid}>
          <SectionCard
            style={styles.createCard}
          >
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
                  setDescription(
                    e.target.value
                  )
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
          </SectionCard>

          <StatCard
            label="Rutinas totales"
            value={workouts.length}
            description="Rutinas registradas por el trainer."
          />
        </section>

        <section style={styles.listSection}>
          <h2 style={styles.sectionTitle}>
            Lista de rutinas
          </h2>

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
                      <p style={styles.workoutTag}>
                        Rutina
                      </p>

                      <h3 style={styles.workoutName}>
                        {workout.name ||
                          "Sin nombre"}
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
                      <p style={styles.infoLabel}>
                        Descripción
                      </p>

                      <p style={styles.infoValue}>
                        {workout.description ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p style={styles.infoLabel}>
                        ID
                      </p>

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
                    <SelectField
                      label="Ejercicio"
                      value={
                        selectedExercises[
                          workout.id
                        ]?.exerciseId || ""
                      }
                      onChange={(e) =>
                        setSelectedExercises(
                          (prev) => ({
                            ...prev,

                            [workout.id]: {
                              ...prev[
                                workout.id
                              ],

                              exerciseId:
                                e.target.value,
                            },
                          })
                        )
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
                    </SelectField>

                    <div style={styles.inlineGrid}>
                      <div style={styles.field}>
                        <label style={styles.label}>
                          Orden
                        </label>

                        <input
                          style={styles.smallInput}
                          type="number"
                          value={
                            selectedExercises[
                              workout.id
                            ]?.exerciseOrder || 1
                          }
                          onChange={(e) =>
                            setSelectedExercises(
                              (prev) => ({
                                ...prev,

                                [workout.id]: {
                                  ...prev[
                                    workout.id
                                  ],

                                  exerciseOrder:
                                    e.target.value,
                                },
                              })
                            )
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
                            selectedExercises[
                              workout.id
                            ]?.sets || 4
                          }
                          onChange={(e) =>
                            setSelectedExercises(
                              (prev) => ({
                                ...prev,

                                [workout.id]: {
                                  ...prev[
                                    workout.id
                                  ],

                                  sets:
                                    e.target.value,
                                },
                              })
                            )
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
                            selectedExercises[
                              workout.id
                            ]?.reps || "12"
                          }
                          onChange={(e) =>
                            setSelectedExercises(
                              (prev) => ({
                                ...prev,

                                [workout.id]: {
                                  ...prev[
                                    workout.id
                                  ],

                                  reps:
                                    e.target.value,
                                },
                              })
                            )
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
                            selectedExercises[
                              workout.id
                            ]?.restSeconds || 60
                          }
                          onChange={(e) =>
                            setSelectedExercises(
                              (prev) => ({
                                ...prev,

                                [workout.id]: {
                                  ...prev[
                                    workout.id
                                  ],

                                  restSeconds:
                                    e.target.value,
                                },
                              })
                            )
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
                          selectedExercises[
                            workout.id
                          ]?.notes || ""
                        }
                        onChange={(e) =>
                          setSelectedExercises(
                            (prev) => ({
                              ...prev,

                              [workout.id]: {
                                ...prev[
                                  workout.id
                                ],

                                notes:
                                  e.target.value,
                              },
                            })
                          )
                        }
                      />
                    </div>

                    <AsyncButton
                      loading={
                        addingExercise[
                          workout.id
                        ]
                      }
                      loadingText="Agregando ejercicio..."
                      onClick={() =>
                        handleAddExercise(
                          workout.id
                        )
                      }
                    >
                      Agregar ejercicio
                    </AsyncButton>

                    {exerciseFeedback[
                      workout.id
                    ] ? (
                      <p
                        style={
                          exerciseFeedback[
                            workout.id
                          ].type === "error"
                            ? styles.error
                            : styles.success
                        }
                      >
                        {
                          exerciseFeedback[
                            workout.id
                          ].message
                        }
                      </p>
                    ) : null}
                  </div>

                  <hr style={styles.divider} />

                  <h4 style={styles.subTitle}>
                    Ejercicios asignados
                  </h4>

                  {!workoutExercises[
                    workout.id
                  ] ||
                  workoutExercises[
                    workout.id
                  ].length === 0 ? (
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
                              {removingExercise[
                                row.id
                              ]
                                ? "Eliminando..."
                                : "Eliminar"}
                            </ActionButton>
                          ),
                        },
                      ]}
                      data={
                        workoutExercises[
                          workout.id
                        ]
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
  sectionTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    fontWeight: "800",
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

  listSection: {
    marginTop: "16px",
  },

  emptyTitle: {
    margin: "0 0 10px 0",
    fontSize: "20px",
    fontWeight: "800",
  },

  workoutGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "16px",
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

  divider: {
    border: "none",
    borderTop:
      "1px solid rgba(148, 163, 184, 0.14)",
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