export default function Surface({
  children,
  style,
}) {
  return (
    <div style={{ ...styles.surface, ...style }}>
      {children}
    </div>
  );
}

const styles = {
  surface: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
  },
};
