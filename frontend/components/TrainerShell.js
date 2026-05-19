"use client";

import Link from "next/link";
import ProtectedRoute from "./ProtectedRoute";
import { logout } from "../lib/auth";

export default function TrainerShell({ title, active, children }) {
  return (
    <ProtectedRoute>
      <main style={styles.page}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Panel del trainer</p>
            <h1 style={styles.title}>{title}</h1>
          </div>

          <button onClick={logout} style={styles.logoutButton}>
            Cerrar sesión
          </button>
        </header>

        <nav style={styles.nav}>
          <Link href="/dashboard" style={active === "dashboard" ? styles.navLinkActive : styles.navLink}>
            Dashboard
          </Link>

          <Link href="/clients" style={active === "clients" ? styles.navLinkActive : styles.navLink}>
            Clientes
          </Link>

          <Link href="/exercises" style={active === "exercises" ? styles.navLinkActive : styles.navLink}>
            Ejercicios
          </Link>

          <Link href="/workouts" style={active === "workouts" ? styles.navLinkActive : styles.navLink}>
            Rutinas
          </Link>

          <Link href="/assignments" style={active === "assignments" ? styles.navLinkActive : styles.navLink}>
            Asignaciones
          </Link>
          <Link href="/progress" style={active === "progress" ? styles.navLinkActive : styles.navLink}>
            Progreso
          </Link>
        </nav>

        {children}
      </main>
    </ProtectedRoute>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)",
    color: "#f8fafc",
    padding: "40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: 0,
    fontSize: "13px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  title: {
    margin: "6px 0 0 0",
    fontSize: "40px",
    fontWeight: "800",
  },
  logoutButton: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    cursor: "pointer",
    fontWeight: "700",
  },
  nav: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  navLink: {
    textDecoration: "none",
    color: "#cbd5e1",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "rgba(15, 23, 42, 0.75)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
  },
  navLinkActive: {
    textDecoration: "none",
    color: "#052e16",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#22c55e",
    fontWeight: "800",
  },
};