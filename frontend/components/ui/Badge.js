export default function Badge({ children, variant = "default" }) {
  const variantStyles = {
    default: {
      background: "rgba(148, 163, 184, 0.14)",
      color: "#cbd5e1",
      border: "1px solid rgba(148, 163, 184, 0.18)",
    },

    success: {
      background: "rgba(34, 197, 94, 0.16)",
      color: "#4ade80",
      border: "1px solid rgba(34, 197, 94, 0.28)",
    },

    warning: {
      background: "rgba(234, 179, 8, 0.16)",
      color: "#facc15",
      border: "1px solid rgba(234, 179, 8, 0.28)",
    },

    danger: {
      background: "rgba(239, 68, 68, 0.16)",
      color: "#f87171",
      border: "1px solid rgba(239, 68, 68, 0.28)",
    },
  };

  return (
    <span
      style={{
        ...styles.badge,
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}

const styles = {
  badge: {
    padding: "8px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
