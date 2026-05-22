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
  const [muscleGroup, setMuscleGroup] =
    useState("Pecho");

  const [description, setDescription] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  async function loadExercises() {
    try {
      const res = await apiFetch("/exercises");

      setExercises(res.data || []);
    } catch (err) {
      console.error(
        "Error cargando ejercicios:",
        err.message
      );
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

      setSuccess(
        "Ejercicio creado correctamente"
      );

      setName("");
      setDescription("");
      setMuscleGroup("Pecho");

      await loadExercises();
    } catch (err) {
      setError(
        err.message ||
          "No se pudo crear el ejercicio"
      );
    } finally {
      setCreating(false);
    }
  }

  const columns = [
    {
      key: "exercise",

      label: "Ejercicio",

      render: (exercise) => (
        <div>
          <p style={styles.exerciseName}>
            {exercise.name || "Sin nombre"}
          </p>

          <p style={styles.exerciseDescription}>
            {exercise.description ||
              "Sin descripción"}
          </p>
        </div>
      ),
    },

    {
      key: "group",

      label: "Grupo muscular",

      render: (exercise) => (
        <Badge variant="default">
          {exercise.muscleGroup || "N/A"}
        </Badge>
      ),
    },

    {
      key: "status",

      label: "Estado",

      render: () => (
        <Badge variant="success">
          Disponible
        </Badge>
      ),
    },
  ];

  return (
    <TrainerShell
      title="Ejercicios"
      active="exercises"
    >
      <PageContainer>
        <section style={styles.topGrid}>
          <SectionCard>
            <div style={styles.header}>
              <div>
                <p style={styles.eyebrow}>
                  Biblioteca de ejercicios
                </p>

                <h2 style={styles.title}>
                  Crear nuevo ejercicio
                </h2>

                <p style={styles.description}>
                  Registra ejercicios con
                  grupos musculares
                  controlados para mantener
                  consistencia en el sistema.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              style={styles.form}
            >
              <div style={styles.field}>
                <label style={styles.label}>
                  Nombre del ejercicio
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Ej: Press banca plano"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
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
                    setMuscleGroup(
                      e.target.value
                    )
                  }
                >
                  {MUSCLE_GROUPS.map(
                    (group) => (
                      <option
                        key={group}
                        value={group}
                      >
                        {group}
                      </option>
                    )
                  )}
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
                    setDescription(
                      e.target.value
                    )
                  }
                />
              </div>

              <div style={styles.actions}>
                <ActionButton
                  disabled={creating}
                >
                  {creating
                    ? "Creando..."
                    : "Crear ejercicio"}
                </ActionButton>
              </div>

              {error ? (
                <p style={styles.error}>
                  {error}
                </p>
              ) : null}

              {success ? (
                <p style={styles.success}>
                  {success}
                </p>
              ) : null}
            </form>
          </SectionCard>

          <StatCard
            label="Ejercicios"
            value={exercises.length}
            description="Ejercicios disponibles en la biblioteca del trainer."
          />
        </section>

        <SectionCard style={styles.tableSection}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.eyebrow}>
                Biblioteca fitness
              </p>

              <h2 style={styles.title}>
                Lista de ejercicios
              </h2>
            </div>

            <Badge variant="default">
              {exercises.length} registros
            </Badge>
          </div>

          {loading ? (
            <LoadingCard>
              Cargando ejercicios...
            </LoadingCard>
          ) : null}

          {!loading &&
          exercises.length === 0 ? (
            <EmptyState>
              Todavía no existen ejercicios
              registrados.
            </EmptyState>
          ) : null}

          {!loading &&
          exercises.length > 0 ? (
            <DataTable
              columns={columns}
              data={exercises}
              emptyMessage="No hay ejercicios disponibles"
            />
          ) : null}
        </SectionCard>
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

    marginBottom: "24px",
  },

  tableSection: {
    minHeight: "auto",
  },

  header: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    marginBottom: "24px",
  },

  sectionHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "24px",
  },

  eyebrow: {
    margin: "0 0 10px 0",

    color: "#4ade80",

    fontSize: "12px",

    fontWeight: "900",

    textTransform: "uppercase",

    letterSpacing: "0.08em",
  },

  title: {
    margin: "0 0 10px 0",

    fontSize: "30px",

    fontWeight: "900",

    color: "#f8fafc",
  },

  description: {
    margin: 0,

    color: "#94a3b8",

    lineHeight: 1.6,

    maxWidth: "680px",
  },

  form: {
    display: "flex",

    flexDirection: "column",

    gap: "18px",
  },

  field: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",
  },

  label: {
    color: "#e2e8f0",

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

  actions: {
    display: "flex",

    justifyContent: "flex-start",

    marginTop: "8px",
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

  exerciseName: {
    margin: "0 0 4px 0",

    fontWeight: "800",

    color: "#f8fafc",
  },

  exerciseDescription: {
    margin: 0,

    color: "#94a3b8",

    fontSize: "13px",

    lineHeight: 1.5,
  },
};