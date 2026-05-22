export default function EmptyState({ children }) {
  return <p style={styles.text}>{children}</p>;
}

const styles = {
  text: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: 1.5,
  },
};
