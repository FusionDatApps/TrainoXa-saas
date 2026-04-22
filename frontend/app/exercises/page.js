"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { getToken, logout } from "../../lib/auth";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/login";
      return;
    }

    async function load() {
      try {
        const res = await apiFetch("/exercises");
        setExercises(res.data || []);
      } catch (error) {
        console.error("Error cargando ejercicios:", error.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Panel del trainer</p>
          <h1 style={styles.title}>Ejercicios</h1>
        </div>

        <button onClick={logout} style={styles.logoutButton}>
          Cerrar sesión
        </button>
      </header>

      <nav style={styles.nav}>
        <Link href="/dashboard" style={styles.navLink}>
          Dashboard
        </Link>
        <Link href="/clients" style={styles.navLink}>
          Clientes
        </Link>
        <Link href="/exercises" style={styles.navLinkActive}>
          Ejercicios
        </Link>
      </nav>

      {loading && (
        <section style={styles.infoCard}>
          <p style={styles.infoText}>Cargando ejercicios...</p>
        </section>
      )}

      {!loading && exercises.length === 0 && (
        <section style={styles.emptyCard}>
          <h2 style={styles.emptyTitle}>Todavía no tienes ejercicios</h2>
          <p style={styles.emptyText}>
            Cuando registres ejercicios en el sistema, aparecerán aquí.
          </p>
        </section>
      )}

      {!loading && exercises.length > 0 && (
        <section style={styles.grid}>
          {exercises.map((exercise) => (
            <article key={exercise.id} style={styles.card}>
              <p style={styles.cardLabel}>Ejercicio</p>
              <h2 style={styles.cardTitle}>
                {exercise.name || "Sin nombre"}
              </h2>

              <div style={styles.metaBlock}>
                <p style={styles.metaText}>
                  <strong>ID:</strong> {exercise.id}
                </p>
                <p style={styles.metaText}>
                  <strong>Grupo muscular:</strong>{" "}
                  {exercise.muscleGroup || "N/A"}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
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
  infoCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
  },
  infoText: {
    margin: 0,
    color: "#cbd5e1",
  },
  emptyCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "28px",
    maxWidth: "540px",
  },
  emptyTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    fontWeight: "800",
  },
  emptyText: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: "1.6",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
  },
  cardLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
  cardTitle: {
    margin: "8px 0 18px 0",
    fontSize: "24px",
    fontWeight: "800",
  },
  metaBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  metaText: {
    margin: 0,
    color: "#cbd5e1",
    wordBreak: "break-word",
  },
};