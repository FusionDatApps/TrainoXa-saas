"use client";

export default function AsyncButton({
  children,
  loading = false,
  disabled = false,
  loadingText = "Procesando...",
  style = {},
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      style={{
        ...styles.button,

        ...(loading || disabled
          ? styles.disabled
          : {}),

        ...style,
      }}
    >
      {loading ? loadingText : children}
    </button>
  );
}

const styles = {
  button: {
    border: "none",

    borderRadius: "12px",

    padding: "14px 18px",

    background:
      "linear-gradient(135deg, #22c55e, #16a34a)",

    color: "#f8fafc",

    fontWeight: "800",

    cursor: "pointer",

    transition: "all 0.2s ease",
  },

  disabled: {
    opacity: 0.7,

    cursor: "not-allowed",
  },
};