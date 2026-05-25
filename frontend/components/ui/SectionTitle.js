export default function SectionTitle({
  eyebrow,
  title,
  description,
}) {
  return (
    <div style={styles.wrapper}>
      {eyebrow ? (
        <p style={styles.eyebrow}>{eyebrow}</p>
      ) : null}

      <h2 style={styles.title}>{title}</h2>

      {description ? (
        <p style={styles.description}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  eyebrow: {
    margin: 0,
    color: "#4ade80",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  title: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "26px",
    fontWeight: "900",
  },

  description: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: 1.6,
  },
};
