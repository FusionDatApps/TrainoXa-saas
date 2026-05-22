export default function ContentStack({
  children,
  gap = 24,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}