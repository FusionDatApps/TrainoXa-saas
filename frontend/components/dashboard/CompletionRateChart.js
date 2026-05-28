"use client";

export default function CompletionRateChart({
  percentage = 0,
}) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,

            width: `${percentage}%`,
          }}
        />
      </div>

      <div style={styles.footer}>
        <span style={styles.label}>
          Cumplimiento
        </span>

        <span style={styles.value}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  track: {
    width: "100%",
    height: "16px",
    borderRadius: "999px",
    background:
      "rgba(148, 163, 184, 0.16)",
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #22c55e, #4ade80)",
    transition: "width 0.3s ease",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#94a3b8",
    fontSize: "13px",
    textTransform: "uppercase",
    fontWeight: "800",
  },

  value: {
    color: "#4ade80",
    fontWeight: "900",
  },
};