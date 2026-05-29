"use client";

import ActionButton from "./ActionButton";

import { theme } from "../../lib/theme";

export default function EmptyDashboardState({
  title = "Todavía no hay datos",
  description = "Comienza creando clientes, rutinas y asignaciones para visualizar métricas reales.",
  actionLabel,
  onAction,
}) {
  return (
    <section style={styles.container}>
      <div style={styles.icon}>
        📊
      </div>

      <h3 style={styles.title}>
        {title}
      </h3>

      <p style={styles.description}>
        {description}
      </p>

      {actionLabel && onAction ? (
        <ActionButton
          onClick={onAction}
        >
          {actionLabel}
        </ActionButton>
      ) : null}
    </section>
  );
}

const styles = {
  container: {
    padding: "48px 24px",

    borderRadius:
      theme.radius.lg,

    background:
      "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.86))",

    border: `1px solid ${theme.colors.border}`,

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    textAlign: "center",

    gap: "18px",
  },

  icon: {
    fontSize: "48px",
  },

  title: {
    margin: 0,

    color:
      theme.colors.textPrimary,

    fontSize: "24px",

    fontWeight: "900",
  },

  description: {
    margin: 0,

    maxWidth: "580px",

    color:
      theme.colors.textSecondary,

    lineHeight: 1.7,
  },
};