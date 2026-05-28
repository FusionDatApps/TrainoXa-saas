"use client";

import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";

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
        <article
          key={item.id}
          style={styles.activityItem}
        >
          <div style={styles.activityContent}>
            <p style={styles.activityTitle}>
              {item.assignment?.client
                ?.fullName ||
                "Cliente sin nombre"}
            </p>

            <p style={styles.activityMeta}>
              {item.exercise?.name ||
                "Ejercicio sin nombre"}{" "}
              •{" "}
              {formatDateTime(
                item.performedAt
              )}
            </p>
          </div>

          <StatusBadge
            variant={
              item.completed
                ? "success"
                : "warning"
            }
          >
            {item.completed
              ? "Completado"
              : "Pendiente"}
          </StatusBadge>
        </article>
      ))}
    </div>
  );
}

const styles = {
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  activityItem: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    borderRadius: "18px",
    background:
      "linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.82))",
    border:
      "1px solid rgba(148, 163, 184, 0.12)",
    boxShadow:
      "0 10px 24px rgba(0, 0, 0, 0.14)",
    flexWrap: "wrap",
  },

  activityContent: {
    flex: 1,
    minWidth: "220px",
  },

  activityTitle: {
    margin: "0 0 6px 0",
    color: "#f8fafc",
    fontWeight: "800",
    fontSize: "15px",
  },

  activityMeta: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: 1.5,
  },
};