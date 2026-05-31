"use client";

import ContentStack from "../ui/ContentStack";
import InlineGroup from "../ui/InlineGroup";
import Badge from "../ui/Badge";

import { theme } from "../../lib/theme";

export default function WorkoutAnalyticsCard({
  title,
  value,
  description,
  trend,
  accent = "#3b82f6",
}) {
  return (
    <section
      style={{
        ...styles.card,
        borderColor: `${accent}30`,
      }}
    >
      <div
        style={{
          ...styles.glow,
          background: accent,
        }}
      />

      <ContentStack gap={18}>
        <InlineGroup justify="space-between" align="flex-start">
          <div style={styles.content}>
            <p style={styles.label}>
              {title}
            </p>

            <h3 style={styles.value}>
              {value}
            </h3>
          </div>

          {trend ? (
            <Badge variant="default">
              {trend}
            </Badge>
          ) : null}
        </InlineGroup>

        {description ? (
          <p style={styles.description}>
            {description}
          </p>
        ) : null}
      </ContentStack>
    </section>
  );
}

const styles = {
  card: {
    position: "relative",
    overflow: "hidden",
    padding: "22px",
    borderRadius: theme.radius.lg,
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.88))",
    border: "1px solid rgba(148,163,184,0.12)",
    minHeight: "148px",
  },

  glow: {
    position: "absolute",
    top: "-20%",
    right: "-10%",
    width: "120px",
    height: "120px",
    borderRadius: "999px",
    opacity: 0.12,
    filter: "blur(42px)",
  },

  content: {
    display: "grid",
    gap: "10px",
  },

  label: {
    margin: 0,
    color: theme.colors.textMuted,
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  value: {
    margin: 0,
    color: theme.colors.textPrimary,
    fontSize: "38px",
    lineHeight: 1,
    fontWeight: "900",
  },

  description: {
    margin: 0,
    color: theme.colors.textSecondary,
    lineHeight: 1.6,
    fontSize: "14px",
  },
};
