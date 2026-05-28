"use client";

import { theme } from "../../lib/theme";

export default function SectionTitle({
  eyebrow,
  title,
}) {
  return (
    <div>
      {eyebrow ? (
        <p style={styles.eyebrow}>
          {eyebrow}
        </p>
      ) : null}

      <h2 style={styles.title}>
        {title}
      </h2>
    </div>
  );
}

const styles = {
  eyebrow: {
    margin: "0 0 6px 0",
    color:
      theme.colors.textMuted,
    ...theme.typography.eyebrow,
  },

  title: {
    margin: 0,
    color:
      theme.colors.textPrimary,
    ...theme.typography.sectionTitle,
  },
};