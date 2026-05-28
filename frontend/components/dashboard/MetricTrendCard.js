"use client";

import SectionCard from "../ui/SectionCard";

export default function MetricTrendCard({
  title,
  value,
  description,
  children,
}) {
  return (
    <SectionCard>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {title}
        </h2>

        <span style={styles.value}>
          {value}
        </span>
      </div>

      <p style={styles.description}>
        {description}
      </p>

      <div style={styles.content}>
        {children}
      </div>
    </SectionCard>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },

  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
  },

  value: {
    color: "#4ade80",
    fontWeight: "900",
    fontSize: "22px",
  },

  description: {
    margin: "0 0 18px 0",
    color: "#94a3b8",
    lineHeight: 1.5,
  },

  content: {
    width: "100%",
  },
};