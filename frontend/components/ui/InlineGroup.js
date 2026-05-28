"use client";

export default function InlineGroup({
  children,
  gap = 12,
  align = "center",
  justify = "flex-start",
  wrap = true,
  style = {},
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: align,
        justifyContent: justify,
        gap: `${gap}px`,
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}