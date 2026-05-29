"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 3500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, type = "info", duration = DEFAULT_DURATION }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      setToasts((current) => [
        ...current,
        {
          id,
          title,
          message,
          type,
        },
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      showToast,
      removeToast,
      success: (payload) => showToast({ ...payload, type: "success" }),
      error: (payload) => showToast({ ...payload, type: "error" }),
      warning: (payload) => showToast({ ...payload, type: "warning" }),
      info: (payload) => showToast({ ...payload, type: "info" }),
    }),
    [showToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div style={styles.wrapper} aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} style={{ ...styles.toast, ...styles[toast.type] }}>
            <div style={styles.content}>
              {toast.title ? <strong style={styles.title}>{toast.title}</strong> : null}
              {toast.message ? <p style={styles.message}>{toast.message}</p> : null}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={styles.closeButton}
              aria-label="Cerrar notificacion"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }

  return context;
}

const styles = {
  wrapper: {
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: "min(380px, calc(100vw - 32px))",
  },
  toast: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(148, 163, 184, 0.24)",
    background: "rgba(15, 23, 42, 0.96)",
    boxShadow: "0 22px 50px rgba(15, 23, 42, 0.24)",
    color: "#f8fafc",
    backdropFilter: "blur(16px)",
  },
  content: {
    display: "grid",
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.2,
  },
  message: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.5,
    color: "rgba(248, 250, 252, 0.76)",
  },
  closeButton: {
    border: "none",
    background: "transparent",
    color: "rgba(248, 250, 252, 0.72)",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
    padding: 0,
  },
  success: {
    borderColor: "rgba(34, 197, 94, 0.42)",
  },
  error: {
    borderColor: "rgba(239, 68, 68, 0.42)",
  },
  warning: {
    borderColor: "rgba(245, 158, 11, 0.46)",
  },
  info: {
    borderColor: "rgba(59, 130, 246, 0.42)",
  },
};
