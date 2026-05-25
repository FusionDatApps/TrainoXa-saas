export default function GridLayout({
  children,
  columns = "repeat(auto-fit, minmax(280px, 1fr))",
  gap = 18,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}
