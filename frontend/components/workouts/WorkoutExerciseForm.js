"use client";

import AsyncButton from "../ui/AsyncButton";
import ContentStack from "../ui/ContentStack";
import ResponsiveGrid from "../ui/ResponsiveGrid";
import SelectField from "../ui/SelectField";

import { theme } from "../../lib/theme";

export default function WorkoutExerciseForm({
  workoutId,
  exercises = [],
  form = {},
  loading = false,
  feedback,
  onChange,
  onSubmit,
}) {
  return (
    <ContentStack gap={14}>
      <h4 style={styles.subTitle}>Agregar ejercicio</h4>

      <SelectField
        label="Ejercicio"
        value={form.exerciseId || ""}
        onChange={(e) =>
          onChange(workoutId, "exerciseId", e.target.value)
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
            value={form.exerciseOrder || 1}
            onChange={(e) =>
              onChange(workoutId, "exerciseOrder", e.target.value)
            }
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Sets</label>

          <input
            style={styles.smallInput}
            type="number"
            value={form.sets || 4}
            onChange={(e) =>
              onChange(workoutId, "sets", e.target.value)
            }
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Reps</label>

          <input
            style={styles.smallInput}
            type="text"
            value={form.reps || "12"}
            onChange={(e) =>
              onChange(workoutId, "reps", e.target.value)
            }
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Descanso</label>

          <input
            style={styles.smallInput}
            type="number"
            value={form.restSeconds || 60}
            onChange={(e) =>
              onChange(workoutId, "restSeconds", e.target.value)
            }
          />
        </div>
      </ResponsiveGrid>

      <div style={styles.field}>
        <label style={styles.label}>Notas</label>

        <textarea
          style={styles.notesInput}
          placeholder="Indicaciones opcionales"
          value={form.notes || ""}
          onChange={(e) =>
            onChange(workoutId, "notes", e.target.value)
          }
        />
      </div>

      <AsyncButton
        loading={loading}
        loadingText="Agregando ejercicio..."
        onClick={() => onSubmit(workoutId)}
      >
        Agregar ejercicio
      </AsyncButton>

      {feedback ? (
        <p
          style={
            feedback.type === "error"
              ? styles.error
              : styles.success
          }
        >
          {feedback.message}
        </p>
      ) : null}
    </ContentStack>
  );
}

const styles = {
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

  subTitle: {
    margin: 0,
    color: theme.colors.textPrimary,
    fontSize: "16px",
    fontWeight: "900",
  },
};
