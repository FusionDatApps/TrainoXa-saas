"use client";

export default function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  loading = false,
  type = "button",
}) {
  const isDisabled =
    disabled || loading;

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

  function handleClick(event) {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      style={{
        ...styles.button,
        ...variantStyles[variant],
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {loading ? "Procesando..." : children}
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
