"use client";

import ActionButton from "./ActionButton";

import { theme } from "../../lib/theme";

export default function EmptyState({
  children,
  title = "No hay datos disponibles",
  description,
  icon = "○",
  actionLabel,
  onAction,
  align = "center",
}) {
  const resolvedDescription = description || children;

  return (
    <section
      style={{
        ...styles.container,
        textAlign: align,
        alignItems: align === "left" ? "flex-start" : "center",
      }}
    >
      <div style={styles.icon}>
        {icon}
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>
          {title}
        </h3>

        {resolvedDescription ? (
          <p style={styles.description}>
            {resolvedDescription}
          </p>
        ) : null}
      </div>

      {actionLabel && onAction ? (
        <ActionButton onClick={onAction}>
          {actionLabel}
        </ActionButton>
      ) : null}
    </section>
  );
}

const styles = {
  container: {
    padding: "36px 24px",
    borderRadius: theme.radius.lg,
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.92), rgba(30,41,59,0.82))",
    border: `1px solid ${theme.colors.border}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "16px",
    minHeight: "180px",
  },

  icon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "rgba(148, 163, 184, 0.12)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    color: theme.colors.textSecondary,
    fontSize: "24px",
    fontWeight: "900",
  },

  content: {
    display: "grid",
    gap: "8px",
    maxWidth: "560px",
  },

  title: {
    margin: 0,
    color: theme.colors.textPrimary,
    fontSize: "20px",
    fontWeight: "900",
    lineHeight: 1.2,
  },

  description: {
    margin: 0,
    color: theme.colors.textSecondary,
    lineHeight: 1.7,
    fontSize: "14px",
  },
};
