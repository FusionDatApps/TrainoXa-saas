"use client";

export default function ContentStack({
  children,
  gap = 16,
  style = {},
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${gap}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}