"use client";

export default function MetricCard({
  label,
  value,
  description,
}) {
  return (
    <article style={styles.card}>
      <p style={styles.label}>{label}</p>

      <strong style={styles.value}>
        {value}
      </strong>

      {description ? (
        <p style={styles.description}>
          {description}
        </p>
      ) : null}
    </article>
  );
}

const styles = {
  card: {
    padding: "20px",
    borderRadius: "18px",
    background:
      "linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.82))",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "0 14px 28px rgba(0, 0, 0, 0.18)",
  },

  label: {
    margin: "0 0 10px 0",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  value: {
    display: "block",
    marginBottom: "10px",
    color: "#f8fafc",
    fontSize: "30px",
    fontWeight: "900",
  },

  description: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.5,
  },
};