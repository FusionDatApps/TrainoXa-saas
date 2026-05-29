"use client";

import { theme } from "../../lib/theme";

export default function FilterPill({
  children,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.pill,
        ...(active
          ? styles.active
          : styles.inactive),
      }}
    >
      {children}
    </button>
  );
}

const styles = {
  pill: {
    padding: "9px 12px",
    borderRadius: theme.radius.full,
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.18s ease",
  },

  active: {
    background: theme.colors.success,
    color: theme.colors.successDark,
    border: `1px solid ${theme.colors.success}`,
  },

  inactive: {
    background: "rgba(15, 23, 42, 0.9)",
    color: theme.colors.textSecondary,
    border: `1px solid ${theme.colors.border}`,
  },
};