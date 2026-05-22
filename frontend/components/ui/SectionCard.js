"use client";

export default function SectionCard({ children, style }) {
  return <article style={{ ...styles.card, ...style }}>{children}</article>;
}

const styles = {
  card: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
    paddingBottom: "32px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
    minHeight: "320px",
  },
};
