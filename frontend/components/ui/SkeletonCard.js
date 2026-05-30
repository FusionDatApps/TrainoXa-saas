"use client";

import { theme } from "../../lib/theme";

export default function SkeletonCard({
  height = 140,
  lines = 3,
  compact = false,
}) {
  return (
    <div
      style={{
        ...styles.card,
        minHeight: height,
        padding: compact ? 16 : 20,
      }}
      aria-hidden="true"
    >
      <div style={styles.shimmer} />

      <div style={styles.content}>
        <div style={styles.headerRow}>
          <div style={styles.avatar} />

          <div style={styles.headerText}>
            <div style={{ ...styles.line, width: "42%" }} />
            <div style={{ ...styles.line, width: "66%" }} />
          </div>
        </div>

        <div style={styles.body}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.line,
                width: `${Math.max(42, 92 - index * 16)}%`,
              }}
            />
          ))}
        </div>

        <div style={styles.footerRow}>
          <div style={{ ...styles.pill, width: 92 }} />
          <div style={{ ...styles.pill, width: 124 }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({
  count = 4,
  min = 260,
  gap = 16,
  height = 180,
}) {
  return (
    <div
      style={{
        ...styles.grid,
        gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
        gap,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} height={height} />
      ))}
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.radius.lg,
    background: "rgba(15, 23, 42, 0.9)",
    border: `1px solid ${theme.colors.border}`,
  },

  shimmer: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
    animation: "skeleton-slide 1.4s infinite",
  },

  content: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    background: "rgba(148, 163, 184, 0.16)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
    flexShrink: 0,
  },

  headerText: {
    flex: 1,
    display: "grid",
    gap: 10,
  },

  body: {
    display: "grid",
    gap: 10,
  },

  line: {
    height: 12,
    borderRadius: 999,
    background: "rgba(148, 163, 184, 0.16)",
  },

  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginTop: "auto",
  },

  pill: {
    height: 30,
    borderRadius: 999,
    background: "rgba(148, 163, 184, 0.14)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },

  grid: {
    display: "grid",
    width: "100%",
  },
};
