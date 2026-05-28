"use client";

import EmptyState from "../ui/EmptyState";

import {
  formatDateTime,
} from "../../lib/dashboard-formatters";

export default function RecentActivityList({
  items = [],
}) {
  if (items.length === 0) {
    return (
      <EmptyState>
        Todavía no hay actividad reciente registrada.
      </EmptyState>
    );
  }

  return (
    <div style={styles.activityList}>
      {items.map((item) => (
        <div
          key={item.id}
          style={styles.activityItem}
        >
          <div>
            <p style={styles.activityTitle}>
              {item.assignment?.client
                ?.fullName ||
                "Cliente sin nombre"}
            </p>

            <p style={styles.activityMeta}>
              {item.exercise?.name ||
                "Ejercicio sin nombre"}{" "}
              ·{" "}
              {formatDateTime(
                item.performedAt
              )}
            </p>
          </div>

          <span
            style={
              item.completed
                ? styles.statusCompleted
                : styles.statusPending
            }
          >
            {item.completed
              ? "Completado"
              : "Pendiente"}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(15, 23, 42, 0.9)",
    border:
      "1px solid rgba(148, 163, 184, 0.12)",
  },

  activityTitle: {
    margin: "0 0 4px 0",
    color: "#f8fafc",
    fontWeight: "800",
  },

  activityMeta: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  statusCompleted: {
    padding: "8px 10px",
    borderRadius: "999px",
    background:
      "rgba(34, 197, 94, 0.16)",
    color: "#4ade80",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  statusPending: {
    padding: "8px 10px",
    borderRadius: "999px",
    background:
      "rgba(234, 179, 8, 0.16)",
    color: "#facc15",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
};