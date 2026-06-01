"use client";

import { CSS } from "@dnd-kit/utilities";

import {
  useSortable,
} from "@dnd-kit/sortable";

import { theme } from "../../lib/theme";

export default function SortableWorkoutExerciseRow({
  id,
  children,
  disabled = false,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
    opacity: isDragging
      ? 0.45
      : disabled
      ? 0.72
      : 1,

    background: isDragging
      ? "rgba(59, 130, 246, 0.08)"
      : "transparent",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div style={styles.row}>
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          style={{
            ...styles.dragHandle,

            cursor: disabled
              ? "not-allowed"
              : "grab",

            opacity: disabled
              ? 0.5
              : 1,
          }}
        >
          ⋮⋮
        </button>

        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    alignItems: "stretch",
    gap: "10px",
    width: "100%",
  },

  dragHandle: {
    width: "38px",
    minWidth: "38px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.sm,
    background: theme.colors.surface,
    color: theme.colors.textMuted,
    fontWeight: "900",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },

  content: {
    flex: 1,
    minWidth: 0,
  },
};