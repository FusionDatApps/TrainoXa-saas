"use client";

import { normalizeChartValues } from "../../lib/chart-helpers";

export default function ActivityBarChart({
  items = [],
}) {
  const normalized =
    normalizeChartValues(
      items.map((item) => ({
        label: item.date,
        value: item.total,
      }))
    );

  return (
    <div style={styles.wrapper}>
      {normalized.map((item) => (
        <div
          key={item.label}
          style={styles.column}
        >
          <div
            style={{
              ...styles.bar,

              height: `${item.height}px`,
            }}
          />

          <span style={styles.value}>
            {item.value}
          </span>

          <span style={styles.label}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "10px",
    minHeight: "180px",
  },

  column: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },

  bar: {
    width: "100%",
    maxWidth: "38px",
    borderRadius: "12px 12px 4px 4px",
    background:
      "linear-gradient(180deg, #22c55e, #14532d)",
    minHeight: "8px",
  },

  value: {
    color: "#f8fafc",
    fontWeight: "800",
    fontSize: "13px",
  },

  label: {
    color: "#94a3b8",
    fontSize: "11px",
    textAlign: "center",
  },
};