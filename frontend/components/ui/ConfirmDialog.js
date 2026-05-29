"use client";

export default function ConfirmDialog({
  open,
  title = "Confirmar accion",
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <div style={styles.content}>
          <h2 style={styles.title}>{title}</h2>

          {description ? (
            <p style={styles.description}>{description}</p>
          ) : null}
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            style={styles.cancelButton}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              ...styles.confirmButton,
              ...(confirmVariant === "danger"
                ? styles.dangerButton
                : styles.primaryButton),
            }}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "rgba(2, 6, 23, 0.72)",
    backdropFilter: "blur(8px)",
  },
  dialog: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 24,
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background: "#0f172a",
    boxShadow: "0 32px 80px rgba(15, 23, 42, 0.45)",
    overflow: "hidden",
  },
  content: {
    padding: 28,
    display: "grid",
    gap: 12,
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#f8fafc",
    lineHeight: 1.2,
  },
  description: {
    margin: 0,
    color: "rgba(226, 232, 240, 0.76)",
    fontSize: 15,
    lineHeight: 1.7,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    padding: "20px 28px 28px",
  },
  cancelButton: {
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "transparent",
    color: "#e2e8f0",
    borderRadius: 14,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },
  confirmButton: {
    border: "none",
    borderRadius: 14,
    padding: "12px 18px",
    cursor: "pointer",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: 14,
  },
  dangerButton: {
    background: "linear-gradient(135deg, #dc2626, #ef4444)",
  },
  primaryButton: {
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  },
};
