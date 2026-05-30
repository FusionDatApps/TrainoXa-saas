"use client";

import { motionStyles } from "../../lib/motion";

export default function Modal({
  open,
  title,
  description,
  children,
  footer,
  size = "md",
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        ...styles.overlay,
        ...motionStyles.fadeOverlay,
      }}
    >
      <section
        style={{
          ...styles.modal,
          ...styles.sizes[size],
          ...motionStyles.modalEnter,
        }}
      >
        <header style={styles.header}>
          <div style={styles.heading}>
            {title ? <h2 style={styles.title}>{title}</h2> : null}

            {description ? (
              <p style={styles.description}>{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Cerrar modal"
          >
            x
          </button>
        </header>

        <div style={styles.body}>{children}</div>

        {footer ? (
          <footer style={styles.footer}>
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "rgba(2, 6, 23, 0.68)",
    backdropFilter: "blur(8px)",
  },

  modal: {
    width: "100%",
    maxHeight: "calc(100vh - 40px)",
    overflow: "hidden",
    borderRadius: 24,
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background: "#0f172a",
    boxShadow: "0 32px 80px rgba(15, 23, 42, 0.45)",
    color: "#f8fafc",
  },

  sizes: {
    sm: {
      maxWidth: 420,
    },

    md: {
      maxWidth: 640,
    },

    lg: {
      maxWidth: 860,
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    padding: "24px 28px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
  },

  heading: {
    display: "grid",
    gap: 8,
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.2,
  },

  description: {
    margin: 0,
    color: "rgba(226, 232, 240, 0.72)",
    fontSize: 14,
    lineHeight: 1.6,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.72)",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 800,
  },

  body: {
    padding: 28,
    maxHeight: "calc(100vh - 220px)",
    overflow: "auto",
  },

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    padding: "20px 28px 28px",
    borderTop: "1px solid rgba(148, 163, 184, 0.12)",
  },
};
