"use client";

import SectionCard from "../ui/SectionCard";
import EmptyState from "../ui/EmptyState";
import SectionTitle from "../ui/SectionTitle";

import { theme } from "../../lib/theme";

export default function TopClientsCard({
  clients = [],
}) {
  return (
    <SectionCard>
      <div style={styles.header}>
        <SectionTitle
          eyebrow="Clientes"
          title="Más activos"
        />
      </div>

      {clients.length === 0 ? (
        <EmptyState>
          Todavía no hay clientes con
          actividad suficiente.
        </EmptyState>
      ) : (
        <div style={styles.list}>
          {clients.map((client, index) => (
            <div
              key={client.id}
              style={styles.item}
            >
              <div style={styles.rank}>
                {index + 1}
              </div>

              <div>
                <p style={styles.name}>
                  {client.fullName}
                </p>

                <p style={styles.meta}>
                  {client.total} registros
                </p>
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

    alignItems: "center",

    gap: "14px",

    padding: "14px",

    borderRadius:
      theme.radius.sm,

    background:
      theme.colors.surface,

    border: `1px solid ${theme.colors.border}`,
  },

  rank: {
    width: "34px",

    height: "34px",

    borderRadius:
      theme.radius.full,

    background:
      theme.colors.success,

    color:
      theme.colors.successDark,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontWeight: "900",
  },

  name: {
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