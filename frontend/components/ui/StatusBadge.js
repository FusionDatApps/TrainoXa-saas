"use client";

export default function StatusBadge({
  children,
  variant = "default",
}) {
  return (
    <span
      style={{
        ...styles.base,
        ...(styles[variant] || styles.default),
      }}
    >
      {children}
    </span>
  );
}

const styles = {
  base: {
    padding: "8px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  default: {
    background: "rgba(148, 163, 184, 0.16)",
    color: "#cbd5e1",
  },

  success: {
    background: "rgba(34, 197, 94, 0.16)",
    color: "#4ade80",
  },

  warning: {
    background: "rgba(234, 179, 8, 0.16)",
    color: "#facc15",
  },

  danger: {
    background: "rgba(248, 113, 113, 0.16)",
    color: "#f87171",
  },
};