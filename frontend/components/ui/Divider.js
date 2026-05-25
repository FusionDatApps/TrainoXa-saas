export default function Divider({
  margin = "18px 0",
}) {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid rgba(148, 163, 184, 0.14)",
        margin,
      }}
    />
  );
}
