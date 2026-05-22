"use client";

export default function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}) {
  const variantStyles = {
    primary: {
      background: "#22c55e",
      color: "#052e16",
      border: "1px solid #22c55e",
    },

    secondary: {
      background: "rgba(15, 23, 42, 0.92)",
      color: "#f8fafc",
      border: "1px solid rgba(148, 163, 184, 0.14)",
    },

    danger: {
      background: "rgba(239, 68, 68, 0.18)",
      color: "#f87171",
      border: "1px solid rgba(239, 68, 68, 0.3)",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.button,
        ...variantStyles[variant],
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

const styles = {
  button: {
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "800",
    transition: "all 0.2s ease",
    fontSize: "14px",
  },
};
