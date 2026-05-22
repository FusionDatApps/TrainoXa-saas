export default function LoadingCard({ children }) {
  return (
    <section style={styles.card}>
      <p style={styles.text}>{children}</p>
    </section>
  );
}

const styles = {
  card: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
  },
  text: {
    margin: 0,
    color: "#cbd5e1",
  },
};
