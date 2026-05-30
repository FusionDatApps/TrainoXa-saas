"use client";

import { theme } from "../../lib/theme";

export default function FeedbackMessage({
  children,
  variant = "info",
  title,
  actionLabel,
  onAction,
}) {
  const selectedVariant = variants[variant] || variants.info;

  return (
    <div
      style={{
        ...styles.message,
        ...selectedVariant.container,
      }}
    >
      <div
        style={{
          ...styles.indicator,
          background: selectedVariant.accent,
        }}
      />

      <div style={styles.content}>
        {title ? (
          <strong
            style={{
              ...styles.title,
              color: selectedVariant.color,
            }}
          >
            {title}
          </strong>
        ) : null}

        <p
          style={{
            ...styles.text,
            color: selectedVariant.color,
          }}
        >
          {children}
        </p>
      </div>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            ...styles.actionButton,
            color: selectedVariant.color,
          }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

const variants = {
  info: {
    accent: "#3b82f6",
    color: "#93c5fd",
    container: {
      background: "rgba(59, 130, 246, 0.12)",
      border: "1px solid rgba(59, 130, 246, 0.25)",
    },
  },

  success: {
    accent: "#22c55e",
    color: "#4ade80",
    container: {
      background: "rgba(34, 197, 94, 0.12)",
      border: "1px solid rgba(34, 197, 94, 0.25)",
    },
  },

  error: {
    accent: "#ef4444",
    color: "#f87171",
    container: {
      background: "rgba(239, 68, 68, 0.12)",
      border: "1px solid rgba(239, 68, 68, 0.25)",
    },
  },

  warning: {
    accent: "#eab308",
    color: "#fde047",
    container: {
      background: "rgba(234, 179, 8, 0.12)",
      border: "1px solid rgba(234, 179, 8, 0.25)",
    },
  },
};

const styles = {
  message: {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 16px 14px 18px",
    borderRadius: theme.radius.sm,
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: 1.5,
    overflow: "hidden",
  },

  indicator: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 999,
    flexShrink: 0,
  },

  content: {
    display: "grid",
    gap: 4,
    flex: 1,
  },

  title: {
    fontSize: "14px",
    fontWeight: "900",
    lineHeight: 1.2,
  },

  text: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.5,
  },

  actionButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "13px",
    padding: 0,
    whiteSpace: "nowrap",
  },
};
