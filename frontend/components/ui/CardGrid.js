export default function CardGrid({
  children,
  minWidth = 320,
  gap = 18,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}
