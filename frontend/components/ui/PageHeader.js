"use client";

import SectionTitle from "./SectionTitle";

import { theme } from "../../lib/theme";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
        />

        {description ? (
          <p style={styles.description}>
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div style={styles.actions}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  description: {
    margin: 0,
    maxWidth: "760px",
    lineHeight: 1.6,
    color:
      theme.colors.textSecondary,
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
};