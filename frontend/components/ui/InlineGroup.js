export default function InlineGroup({
  children,
  justify = "flex-start",
  align = "center",
  gap = 12,
  wrap = true,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: justify,
        alignItems: align,
        gap: `${gap}px`,
        flexWrap: wrap ? "wrap" : "nowrap",
      }}
    >
      {children}
    </div>
  );
}