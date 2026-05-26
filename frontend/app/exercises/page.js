"use client";

import { useState } from "react";

import useFetch from "../../hooks/useFetch";
import useMutation from "../../hooks/useMutation";
import TrainerShell from "../../components/TrainerShell";

import { apiFetch } from "../../lib/api";
import { uiStyles } from "../../lib/ui-styles";
import { layoutStyles } from "../../lib/layout-styles";

import PageContainer from "../../components/ui/PageContainer";
import SectionCard from "../../components/ui/SectionCard";
import StatCard from "../../components/ui/StatCard";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";
import FormActions from "../../components/ui/FormActions";
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
  const {
    data: exercises = [],
    loading,
    refetch,
  } = useFetch("/exercises", {
    initialData: [],
  });

  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Pecho");
  const [description, setDescription] = useState("");

  const {
    loading: creating,
    error,
    success,
    mutate,
    setSuccessMessage,
  } = useMutation(async (payload) => {
    return apiFetch("/exercises", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await mutate({
      name,
      muscleGroup,
      description,
    });

    setSuccessMessage("Ejercicio creado correctamente");

    setName("");
    setDescription("");
    setMuscleGroup("Pecho");

    await refetch();
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
            {exercise.description || "Sin descripción"}
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
          <section style={layoutStyles.topGrid}>
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
                  onChange={(e) => setName(e.target.value)}
                />

                <div style={uiStyles.stack}>
                  <label style={layoutStyles.label}>
                    Grupo muscular
                  </label>

                  <select
                    style={layoutStyles.select}
                    value={muscleGroup}
                    onChange={(e) =>
                      setMuscleGroup(e.target.value)
                    }
                  >
                    {MUSCLE_GROUPS.map((group) => (
                      <option
                        key={group}
                        value={group}
                      >
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <FormField
                  label="Descripción"
                  placeholder="Opcional"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  textarea
                />

                <FormActions
                  loading={creating}
                  submitText="Crear ejercicio"
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
              label="Ejercicios"
              value={exercises.length}
              description="Ejercicios disponibles en la biblioteca del trainer."
            />
          </section>

          <SectionCard style={styles.tableSection}>
            <div style={uiStyles.sectionHeader}>
              <div>
                <p style={layoutStyles.eyebrow}>
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

            {!loading && exercises.length === 0 ? (
              <EmptyState>
                Todavía no existen ejercicios registrados.
              </EmptyState>
            ) : null}

            {!loading && exercises.length > 0 ? (
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
  tableSection: {
    minHeight: "auto",
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