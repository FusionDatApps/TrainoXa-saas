"use client";

import { theme } from "../../lib/theme";

export default function MetricCard({
  label,
  value,
  description,
}) {
  return (
    <article style={styles.card}>
      <p style={styles.label}>{label}</p>

      <strong style={styles.value}>
        {value}
      </strong>

      {description ? (
        <p style={styles.description}>
          {description}
        </p>
      ) : null}
    </article>
  );
}

const styles = {
  card: {
    padding: "20px",
    borderRadius: theme.radius.md,
    background: `linear-gradient(145deg, ${theme.colors.surface}, ${theme.colors.surfaceAlt})`,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.card,
  },

  label: {
    margin: "0 0 10px 0",
    color: theme.colors.textMuted,
    ...theme.typography.eyebrow,
    letterSpacing: "0.06em",
  },

  value: {
    display: "block",
    marginBottom: "10px",
    color: theme.colors.textPrimary,
    fontSize: "30px",
    fontWeight: "900",
  },

  description: {
    margin: 0,
    color: theme.colors.textSecondary,
    fontSize: "14px",
    lineHeight: 1.5,
  },
};