"use client";

import SectionCard from "../ui/SectionCard";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";
import SectionTitle from "../ui/SectionTitle";

import { theme } from "../../lib/theme";

export default function ProgressTrendCard({
  items = [],
}) {
  return (
    <SectionCard>
      <div style={styles.header}>
        <SectionTitle
          eyebrow="Tendencia"
          title="Progreso reciente"
        />
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

              <StatusBadge variant="success">
                {item.percentage}%
              </StatusBadge>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

const styles = {
  header: {
    marginBottom:
      theme.spacing.lg,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
  },

  item: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    padding: "14px",

    borderRadius:
      theme.radius.sm,

    background:
      theme.colors.surface,

    border: `1px solid ${theme.colors.border}`,
  },

  date: {
    margin: "0 0 4px 0",

    color:
      theme.colors.textPrimary,

    fontWeight: "800",
  },

  meta: {
    margin: 0,

    color:
      theme.colors.textMuted,

    fontSize: "13px",
  },
};