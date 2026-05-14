export const dynamic = "force-dynamic";

export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "#f8fafc",
        fontFamily: "sans-serif",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          margin: 0,
        }}
      >
        404
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "#94a3b8",
        }}
      >
        Página no encontrada
      </p>
    </main>
  );
}