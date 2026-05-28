"use client";

export default function DashboardGrid({
  children,
}) {
  return (
    <section style={styles.grid}>
      {children}
    </section>
  );
}

const styles = {
  grid: {
    display: "grid",

    gridTemplateColumns:
      "1fr 1.4fr",

    gap: "16px",
  },
};