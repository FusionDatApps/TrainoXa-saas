"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { getToken, logout } from "../../lib/auth";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/login";
      return;
    }

    async function load() {
      try {
        const res = await apiFetch("/dashboard/summary");
        setData(res.data || {});
      } catch (error) {
        console.error("Error cargando dashboard:", error.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const metrics = [
    {
      label: "Clientes",
      value: data?.totalClientes ?? 0,
    },
    {
      label: "Ejercicios",
      value: data?.totalEjercicios ?? 0,
    },
    {
      label: "Rutinas",
      value: data?.totalRutinas ?? 0,
    },
    {
      label: "Asignaciones activas",
      value: data?.totalAsignacionesActivas ?? 0,
    },
    {
      label: "Registros de progreso",
      value: data?.totalProgreso ?? 0,
    },
  ];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Panel del trainer</p>
          <h1 style={styles.title}>Dashboard</h1>
        </div>

        <button onClick={logout} style={styles.logoutButton}>
          Cerrar sesión
        </button>
      </header>

      <nav style={styles.nav}>
        <Link href="/dashboard" style={styles.navLinkActive}>
          Dashboard
        </Link>
        <Link href="/clients" style={styles.navLink}>
          Clientes
        </Link>
        <Link href="/exercises" style={styles.navLink}>
          Ejercicios
        </Link>
      </nav>

      {loading ? (
        <section style={styles.infoCard}>
          <p style={styles.infoText}>Cargando resumen del dashboard...</p>
        </section>
      ) : (
        <section style={styles.metricsGrid}>
          {metrics.map((item) => (
            <article key={item.label} style={styles.metricCard}>
              <p style={styles.metricLabel}>{item.label}</p>
              <h2 style={styles.metricValue}>{item.value}</h2>
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
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  metricCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
  },
  metricLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
  metricValue: {
    margin: "12px 0 0 0",
    fontSize: "36px",
    fontWeight: "800",
    color: "#f8fafc",
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
};