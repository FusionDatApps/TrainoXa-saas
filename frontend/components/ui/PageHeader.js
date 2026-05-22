export default function PageHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <header style={styles.header}>
      <div>
        {eyebrow ? (
          <p style={styles.eyebrow}>{eyebrow}</p>
        ) : null}

        <h1 style={styles.title}>{title}</h1>

        {description ? (
          <p style={styles.description}>
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },

  eyebrow: {
    margin: "0 0 8px 0",
    color: "#22c55e",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  title: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "40px",
    fontWeight: "900",
  },

  description: {
    margin: "12px 0 0 0",
    color: "#94a3b8",
    lineHeight: 1.6,
    maxWidth: "720px",
  },
};