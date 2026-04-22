"use client";

import { useState } from "react";
import { saveToken } from "../../lib/auth";
import { apiFetch } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token = res?.data?.token;

      if (!token) {
        throw new Error("No se recibió token en el login");
      }

      saveToken(token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>TrainoXa</h1>
        <p style={styles.subtitle}>Inicia sesión como trainer</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {error ? <p style={styles.error}>{error}</p> : null}
        </form>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "18px",
    padding: "32px",
    boxShadow: "0 20px 45px rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(8px)",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "32px",
    fontWeight: "800",
    color: "#f8fafc",
    textAlign: "center",
  },
  subtitle: {
    margin: "0 0 24px 0",
    fontSize: "14px",
    color: "#94a3b8",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    marginTop: "6px",
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#22c55e",
    color: "#052e16",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },
  error: {
    margin: "4px 0 0 0",
    color: "#f87171",
    fontSize: "14px",
    textAlign: "center",
  },
};