export default function FormSection({
  title,
  description,
  children,
}) {
  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>{title}</h2>

        {description ? (
          <p style={styles.description}>
            {description}
          </p>
        ) : null}
      </div>

      <div style={styles.content}>
        {children}
      </div>
    </section>
  );
}

const styles = {
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  header: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  title: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "24px",
    fontWeight: "900",
  },

  description: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: 1.6,
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
};