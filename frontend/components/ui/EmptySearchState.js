"use client";

import { theme } from "../../lib/theme";

export default function EmptySearchState({
  title = "Sin resultados",
  description = "No encontramos registros que coincidan con tu búsqueda o filtros actuales.",
}) {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>🔎</div>

      <h3 style={styles.title}>{title}</h3>

      <p style={styles.description}>
        {description}
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: "34px 20px",
    borderRadius: theme.radius.lg,
    background: "rgba(15, 23, 42, 0.74)",
    border: `1px solid ${theme.colors.border}`,
    textAlign: "center",
  },

  icon: {
    fontSize: "34px",
    marginBottom: "10px",
  },

  title: {
    margin: "0 0 8px 0",
    color: theme.colors.textPrimary,
    fontSize: "20px",
    fontWeight: "900",
  },

  description: {
    margin: 0,
    color: theme.colors.textMuted,
    lineHeight: 1.5,
  },
};