"use client";

import { motionStyles } from "../../lib/motion";

export default function Drawer({
  open,
  title,
  description,
  children,
  footer,
  position = "right",
  width = 440,
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
      <aside
        style={{
          ...styles.drawer,
          width,
          ...(position === "left" ? styles.left : styles.right),
          ...(position === "left"
            ? motionStyles.drawerLeft
            : motionStyles.drawerRight),
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
            aria-label="Cerrar drawer"
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
      </aside>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1150,
    background: "rgba(2, 6, 23, 0.58)",
    backdropFilter: "blur(6px)",
  },

  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    background: "#0f172a",
    borderLeft: "1px solid rgba(148, 163, 184, 0.14)",
    borderRight: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.46)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    color: "#f8fafc",
  },

  left: {
    left: 0,
  },

  right: {
    right: 0,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "24px 24px 20px",
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
    flexShrink: 0,
  },

  body: {
    flex: 1,
    overflow: "auto",
    padding: 24,
  },

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    padding: 24,
    borderTop: "1px solid rgba(148, 163, 184, 0.12)",
  },
};
