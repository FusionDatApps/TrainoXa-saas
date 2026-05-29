"use client";

import { theme } from "../../lib/theme";

export default function SkeletonCard({
  height = 140,
}) {
  return (
    <div
      style={{
        ...styles.card,
        height,
      }}
    >
      <div style={styles.shimmer} />
    </div>
  );
}

const styles = {
  card: {
    position: "relative",

    overflow: "hidden",

    borderRadius:
      theme.radius.lg,

    background:
      "rgba(15, 23, 42, 0.9)",

    border: `1px solid ${theme.colors.border}`,
  },

  shimmer: {
    position: "absolute",

    inset: 0,

    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",

    animation:
      "skeleton-slide 1.4s infinite",
  },
};