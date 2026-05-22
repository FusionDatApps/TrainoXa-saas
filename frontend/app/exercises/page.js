"use client";

import { useEffect, useState } from "react";

import TrainerShell from "../../components/TrainerShell";

import { apiFetch } from "../../lib/api";
import { extractApiError } from "../../lib/form-helpers";
import { uiStyles } from "../../lib/ui-styles";

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
      setError(extractApiError(err));
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
        <div style={uiStyles.page}>
          <section style={styles.topGrid}>
            <SectionCard>
              <PageHeader
                eyebrow="Biblioteca fitness"
                title="Crear nuevo ejercicio"
                description="Registra ejercicios con grupos musculares controlados para mantener consistencia en el sistema."
              />

              <form
                onSubmit={handleSubmit}
                style={uiStyles.stack}
              >
                <FormField
                  label="Nombre del ejercicio"
                  placeholder="Ej: Press banca plano"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

                <div style={uiStyles.stack}>
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
              label="Ejercicios"
              value={exercises.length}
              description="Ejercicios disponibles en la biblioteca del trainer."
            />
          </section>

          <SectionCard style={styles.tableSection}>
            <div style={uiStyles.sectionHeader}>
              <div>
                <p style={styles.eyebrow}>
                  Biblioteca fitness
                </p>

                <h2 style={uiStyles.sectionTitle}>
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

  actions: {
    display: "flex",

    justifyContent: "flex-start",

    marginTop: "8px",
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