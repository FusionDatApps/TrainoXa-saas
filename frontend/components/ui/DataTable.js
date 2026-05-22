export default function DataTable({
  columns = [],
  data = [],
  emptyMessage = "No hay datos disponibles",
}) {
  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={styles.th}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={row.id || index} style={styles.tr}>
                {columns.map((column) => (
                  <td key={column.key} style={styles.td}>
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                style={styles.emptyCell}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrapper: {
    overflowX: "auto",
    borderRadius: "18px",
    border: "1px solid rgba(148, 163, 184, 0.14)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(15, 23, 42, 0.92)",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    color: "#94a3b8",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
    background: "rgba(2, 6, 23, 0.92)",
  },

  tr: {
    transition: "background 0.2s ease",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
    color: "#f8fafc",
    fontSize: "14px",
    verticalAlign: "middle",
  },

  emptyCell: {
    padding: "28px",
    textAlign: "center",
    color: "#94a3b8",
  },
};
