"use client";

export default function StatCard({ label, value, description }) {
  return (
    <article
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.14)";
      }}
    >
      <p style={styles.label}>{label}</p>
      <h2 style={styles.value}>{value}</h2>
      <p style={styles.description}>{description}</p>
    </article>
  );
}

const styles = {
  card: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "150px",
    transition: "all 0.2s ease",
  },
  label: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
  value: {
    margin: "12px 0 8px 0",
    fontSize: "36px",
    fontWeight: "800",
    color: "#f8fafc",
  },
  description: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.5,
  },
};
