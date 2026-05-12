"use client";

import { useEffect, useState } from "react";
import TrainerShell from "../../components/TrainerShell";
import { apiFetch } from "../../lib/api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <TrainerShell title="Dashboard" active="dashboard">
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
    </TrainerShell>
  );
}

const styles = {
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