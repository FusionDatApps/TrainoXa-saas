export const uiStyles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "24px",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "26px",
    fontWeight: "900",
  },

  sectionDescription: {
    margin: "8px 0 0 0",
    color: "#94a3b8",
    lineHeight: 1.6,
  },

  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },

  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};