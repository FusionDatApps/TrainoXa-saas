import { colors } from "./tokens";

export const typography = {
  eyebrow: {
    margin: 0,
    color: colors.brand.primary,
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  pageTitle: {
    margin: 0,
    color: colors.text.primary,
    fontSize: "40px",
    fontWeight: "900",
  },

  sectionTitle: {
    margin: 0,
    color: colors.text.primary,
    fontSize: "26px",
    fontWeight: "900",
  },

  cardTitle: {
    margin: 0,
    color: colors.text.primary,
    fontSize: "22px",
    fontWeight: "800",
  },

  body: {
    margin: 0,
    color: colors.text.secondary,
    lineHeight: 1.6,
  },

  muted: {
    margin: 0,
    color: colors.text.muted,
    lineHeight: 1.5,
  },

  label: {
    color: colors.text.secondary,
    fontSize: "14px",
    fontWeight: "700",
  },
};
