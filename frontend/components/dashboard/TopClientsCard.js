"use client";

import SectionCard from "../ui/SectionCard";
import EmptyState from "../ui/EmptyState";

export default function TopClientsCard({
  clients = [],
}) {
  return (
    <SectionCard>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>
            Clientes
          </p>

          <h2 style={styles.title}>
            Más activos
          </h2>
        </div>
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
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    borderRadius: "14px",
    background:
      "rgba(15, 23, 42, 0.9)",
    border:
      "1px solid rgba(148, 163, 184, 0.12)",
  },

  rank: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    background: "#22c55e",
    color: "#052e16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  name: {
    margin: "0 0 4px 0",
    color: "#f8fafc",
    fontWeight: "800",
  },

  meta: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },
};