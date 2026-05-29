"use client";

import Link from "next/link";

import { theme } from "../../lib/theme";

export default function QuickActionCard({
  title,
  description,
  href,
  accent = "#22c55e",
}) {
  return (
    <Link
      href={href}
      style={{
        ...styles.card,
        borderColor: `${accent}35`,
      }}
    >
      <div
        style={{
          ...styles.accent,
          background: accent,
        }}
      />

      <div>
        <h3 style={styles.title}>
          {title}
        </h3>

        <p style={styles.description}>
          {description}
        </p>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    position: "relative",

    overflow: "hidden",

    display: "flex",

    gap: "18px",

    padding: "22px",

    borderRadius:
      theme.radius.lg,

    background:
      "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.82))",

    border: "1px solid",

    textDecoration: "none",

    transition:
      "transform 0.18s ease, border-color 0.18s ease",
  },

  accent: {
    width: "6px",

    borderRadius: "999px",
  },

  title: {
    margin: "0 0 8px 0",

    color:
      theme.colors.textPrimary,

    fontWeight: "900",

    fontSize: "18px",
  },

  description: {
    margin: 0,

    color:
      theme.colors.textSecondary,

    lineHeight: 1.6,
  },
};