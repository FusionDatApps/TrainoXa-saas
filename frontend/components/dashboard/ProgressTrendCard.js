"use client";

import SectionCard from "../ui/SectionCard";
import EmptyState from "../ui/EmptyState";

export default function ProgressTrendCard({
  items = [],
}) {
  return (
    <SectionCard>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>
            Tendencia
          </p>

          <h2 style={styles.title}>
            Progreso reciente
          </h2>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState>
          Todavía no hay suficiente
          actividad para generar
          tendencia.
        </EmptyState>
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <div
              key={item.date}
              style={styles.item}
            >
              <div>
                <p style={styles.date}>
                  {item.date}
                </p>

                <p style={styles.meta}>
                  {item.completed}/
                  {item.total} completados
                </p>
              </div>

              <div style={styles.badge}>
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

const styles = {
  header: {
    marginBottom: "18px",
  },

  eyebrow: {
    margin: "0 0 6px 0",
    color: "#94a3b8",
    fontSize: "13px",
    textTransform: "uppercase",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px",
    borderRadius: "14px",
    background:
      "rgba(15, 23, 42, 0.9)",
    border:
      "1px solid rgba(148, 163, 184, 0.12)",
  },

  date: {
    margin: "0 0 4px 0",
    color: "#f8fafc",
    fontWeight: "800",
  },

  meta: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  badge: {
    padding: "8px 12px",
    borderRadius: "999px",
    background:
      "rgba(34, 197, 94, 0.16)",
    color: "#4ade80",
    fontWeight: "900",
  },
};