import { colors, radius, shadows, spacing } from "./tokens";

export const surfaces = {
  card: {
    background: colors.background.panel,
    border: `1px solid ${colors.border.soft}`,
    borderRadius: radius.lg,
    padding: spacing.xl,
    boxShadow: shadows.card,
  },

  softCard: {
    background: colors.background.panelSoft,
    border: `1px solid ${colors.border.soft}`,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  input: {
    padding: "14px 16px",
    borderRadius: radius.md,
    border: `1px solid ${colors.border.medium}`,
    background: "#0f172a",
    color: colors.text.primary,
    fontSize: "15px",
    outline: "none",
  },

  divider: {
    border: "none",
    borderTop: `1px solid ${colors.border.soft}`,
    margin: "18px 0",
  },
};
