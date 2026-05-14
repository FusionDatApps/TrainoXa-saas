"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="es">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#020617",
          color: "#f8fafc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main style={{ textAlign: "center" }}>
          <h1>Error inesperado</h1>
          <p>Algo salió mal en TrainoXa.</p>

          <button
            onClick={reset}
            style={{
              marginTop: "16px",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#22c55e",
              color: "#052e16",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}