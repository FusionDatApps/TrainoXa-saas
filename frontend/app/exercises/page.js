"use client";

import { useEffect, useState } from "react";
import TrainerShell from "../../components/TrainerShell";
import { apiFetch } from "../../lib/api";

export const dynamic = "force-dynamic";

const MUSCLE_GROUPS = [
  "Pecho",
  "Espalda",
  "Pierna",
  "Hombro",
  "Bíceps",
  "Tríceps",
  "Abdomen",
  "Cardio",
];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Pecho");
  const [description, setDescription] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadExercises() {
    try {
      const res = await apiFetch("/exercises");
      setExercises(res.data || []);
    } catch (err) {
      console.error("Error cargando ejercicios:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExercises();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch("/exercises", {
        method: "POST",
        body: JSON.stringify({
          name,
          muscleGroup,
          description,
        }),
      });

      setSuccess("Ejercicio creado correctamente");

      setName("");
      setDescription("");
      setMuscleGroup("Pecho");

      await loadExercises();
    } catch (err) {
      setError(err.message || "No se pudo crear el ejercicio");
    } finally {
      setCreating(false);
    }
  }

  return (
    <TrainerShell title="Ejercicios" active="exercises">
      <section style={styles.grid}>
        <article style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Crear ejercicio</h2>

          <p style={styles.sectionText}>
            Registra ejercicios con un grupo muscular
            controlado.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>
                Nombre del ejercicio
              </label>

              <input
                style={styles.input}
                type="text"
                placeholder="Ej: Press banca plano"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Grupo muscular
              </label>

              <select
                style={styles.select}
                value={muscleGroup}
                onChange={(e) =>
                  setMuscleGroup(e.target.value)
                }
              >
                {MUSCLE_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Descripción
              </label>

              <textarea
                style={styles.textarea}
                placeholder="Opcional"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={creating}
            >
              {creating
                ? "Creando..."
                : "Crear ejercicio"}
            </button>

            {error ? (
              <p style={styles.error}>{error}</p>
            ) : null}

            {success ? (
              <p style={styles.success}>{success}</p>
            ) : null}
          </form>
        </article>

        <aside style={styles.summaryCard}>
          <p style={styles.summaryLabel}>
            Total de ejercicios
          </p>

          <h3 style={styles.summaryValue}>
            {exercises.length}
          </h3>

          <p style={styles.summaryText}>
            Usa grupos musculares predefinidos para
            mantener consistencia en el catálogo.
          </p>
        </aside>
      </section>

      <section style={styles.listSection}>
        <h2 style={styles.sectionTitle}>
          Lista de ejercicios
        </h2>

        {loading ? (
          <div style={styles.emptyCard}>
            <p style={styles.sectionText}>
              Cargando ejercicios...
            </p>
          </div>
        ) : null}

        {!loading && exercises.length === 0 ? (
          <div style={styles.emptyCard}>
            <h3 style={styles.emptyTitle}>
              Todavía no tienes ejercicios
            </h3>

            <p style={styles.sectionText}>
              Cuando registres ejercicios en el
              sistema, aparecerán aquí.
            </p>
          </div>
        ) : null}

        {!loading && exercises.length > 0 ? (
          <div style={styles.exerciseGrid}>
            {exercises.map((exercise) => (
              <article
                key={exercise.id}
                style={styles.exerciseCard}
              >
                <p style={styles.exerciseTag}>
                  Ejercicio
                </p>

                <h3 style={styles.exerciseName}>
                  {exercise.name || "Sin nombre"}
                </h3>

                <p style={styles.exerciseInfo}>
                  <strong>ID:</strong> {exercise.id}
                </p>

                <p style={styles.exerciseInfo}>
                  <strong>Grupo muscular:</strong>{" "}
                  {exercise.muscleGroup || "N/A"}
                </p>

                <p style={styles.exerciseInfo}>
                  <strong>Descripción:</strong>{" "}
                  {exercise.description || "N/A"}
                </p>
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

  select: {
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

  exerciseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },

  exerciseCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "22px",
  },

  exerciseTag: {
    margin: "0 0 10px 0",
    color: "#94a3b8",
    fontSize: "13px",
    textTransform: "uppercase",
  },

  exerciseName: {
    margin: "0 0 16px 0",
    fontSize: "30px",
    fontWeight: "800",
  },

  exerciseInfo: {
    margin: "0 0 10px 0",
    color: "#e2e8f0",
    lineHeight: 1.5,
  },
};