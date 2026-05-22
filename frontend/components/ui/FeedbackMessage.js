export default function FeedbackMessage({
  children,
  variant = "info",
}) {
  const variants = {
    info: {
      background: "rgba(59, 130, 246, 0.12)",
      border: "1px solid rgba(59, 130, 246, 0.25)",
      color: "#93c5fd",
    },

    success: {
      background: "rgba(34, 197, 94, 0.12)",
      border: "1px solid rgba(34, 197, 94, 0.25)",
      color: "#4ade80",
    },

    error: {
      background: "rgba(239, 68, 68, 0.12)",
      border: "1px solid rgba(239, 68, 68, 0.25)",
      color: "#f87171",
    },

    warning: {
      background: "rgba(234, 179, 8, 0.12)",
      border: "1px solid rgba(234, 179, 8, 0.25)",
      color: "#fde047",
    },
  };

  return (
    <div
      style={{
        ...styles.message,
        ...variants[variant],
      }}
    >
      {children}
    </div>
  );
}

const styles = {
  message: {
    padding: "14px 16px",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: 1.5,
  },
};