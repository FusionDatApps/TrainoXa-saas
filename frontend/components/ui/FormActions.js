"use client";

import ActionButton from "./ActionButton";

export default function FormActions({
  submitText = "Guardar",
  cancelText,
  onCancel,
  loading = false,
}) {
  return (
    <div style={styles.wrapper}>
      {cancelText ? (
        <ActionButton
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </ActionButton>
      ) : null}

      <ActionButton
        variant="primary"
        disabled={loading}
      >
        {loading ? "Procesando..." : submitText}
      </ActionButton>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
};