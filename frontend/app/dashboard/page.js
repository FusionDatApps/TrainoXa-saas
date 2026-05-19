"use client";

import { useEffect, useMemo, useState } from "react";
import TrainerShell from "../../components/TrainerShell";
import { apiFetch } from "../../lib/api";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [summaryRes, activityRes] = await Promise.all([
        apiFetch("/dashboard/summary"),
        apiFetch("/dashboard/recent-activity"),
      ]);

      setSummary(summaryRes.data || {});
      setRecentActivity(activityRes.data || []);
    } catch (err) {
      setError(err.message || "No se pudo cargar el dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const completionRate = useMemo(() => {
    const total = summary?.totalProgreso || 0;
    const completed = summary?.totalCompletados || 0;

    if (total === 0) {
      return 0;
    }

    return Math.round((completed / total) * 100);
  }, [summary]);

  const metrics = [
    {
      label: "Clientes",
      value: summary?.totalClientes ?? 0,
      description: "Clientes registrados por el trainer",
    },
    {
      label: "Rutinas",
      value: summary?.totalRutinas ?? 0,
      description: "Planes de entrenamiento creados",
    },
    {
      label: "Asignaciones activas",
      value: summary?.totalAsignacionesActivas ?? 0,
      description: "Rutinas actualmente asignadas",
    },
    {
      label: "Registros de progreso",
      value: summary?.totalProgreso ?? 0,
      description: "Entrenamientos reportados",
    },
    {
      label: "Ejercicios completados",
      value: summary?.totalCompletados ?? 0,
      description: "Registros marcados como completados",
    },
    {
      label: "Volumen total",
      value: `${summary?.volumenTotalKg ?? 0} kg`,
      description: "Suma de peso registrado",
    },
    {
      label: "Clientes con actividad",
      value: summary?.clientesConActividad ?? 0,
      description: "Clientes con progreso registrado",
    },
    
  ];

  return (
    <TrainerShell title="Dashboard" active="dashboard">
      {loading ? (
        <section style={styles.infoCard}>
          <p style={styles.infoText}>Cargando resumen del dashboard...</p>
        </section>
      ) : null}

      {!loading && error ? (
        <section style={styles.infoCard}>
          <p style={styles.errorText}>{error}</p>
        </section>
      ) : null}

      {!loading && !error ? (
        <>
          <section style={styles.heroCard}>
            <div>
              <p style={styles.heroEyebrow}>Resumen del negocio fitness</p>

              <h2 style={styles.heroTitle}>
                Control operativo y progreso real de tus clientes
              </h2>

              <p style={styles.heroText}>
                Este panel combina clientes, rutinas, asignaciones y registros
                de progreso para mostrar el estado real del entrenamiento.
              </p>
            </div>

            <div style={styles.heroBadge}>
              <span style={styles.heroBadgeNumber}>{completionRate}%</span>
              <span style={styles.heroBadgeLabel}>cumplimiento</span>
            </div>
          </section>

          <section style={styles.metricsGrid}>
            {metrics.map((item) => (
              <article
                key={item.label}
                style={styles.metricCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor =
                    "rgba(34, 197, 94, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor =
                    "rgba(148, 163, 184, 0.14)";
                }}
              >
                <p style={styles.metricLabel}>{item.label}</p>
                <h2 style={styles.metricValue}>{item.value}</h2>
                <p style={styles.metricDescription}>{item.description}</p>
              </article>
            ))}
          </section>

          <section style={styles.analyticsGrid}>
            <article style={styles.panelCard}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelEyebrow}>Ranking</p>
                  <h2 style={styles.sectionTitle}>Ejercicios más usados</h2>
                </div>
              </div>

              {summary?.ejerciciosMasUsados?.length > 0 ? (
                <div style={styles.rankingList}>
                  {summary.ejerciciosMasUsados.map((exercise, index) => (
                    <div key={exercise.exerciseId} style={styles.rankingItem}>
                      <span style={styles.rankingPosition}>{index + 1}</span>

                      <div>
                        <p style={styles.rankingName}>{exercise.name}</p>
                        <p style={styles.rankingMeta}>
                          {exercise.total} registro
                          {exercise.total === 1 ? "" : "s"} de progreso
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.emptyText}>
                  Todavía no hay ejercicios con progreso registrado.
                </p>
              )}
            </article>

            <article style={styles.panelCard}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelEyebrow}>Actividad</p>
                  <h2 style={styles.sectionTitle}>Últimos registros</h2>
                </div>
              </div>

              {recentActivity.length > 0 ? (
                <div style={styles.activityList}>
                  {recentActivity.map((item) => (
                    <div key={item.id} style={styles.activityItem}>
                      <div>
                        <p style={styles.activityTitle}>
                          {item.assignment?.client?.fullName ||
                            "Cliente sin nombre"}
                        </p>

                        <p style={styles.activityMeta}>
                          {item.exercise?.name || "Ejercicio sin nombre"} ·{" "}
                          {item.performedAt
                            ? new Date(item.performedAt).toLocaleString()
                            : "Sin fecha"}
                        </p>
                      </div>

                      <span
                        style={
                          item.completed
                            ? styles.statusCompleted
                            : styles.statusPending
                        }
                      >
                        {item.completed ? "Completado" : "Pendiente"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.emptyText}>
                  Todavía no hay actividad reciente registrada.
                </p>
              )}
            </article>
          </section>
        </>
      ) : null}
    </TrainerShell>
  );
}

const styles = {
  heroCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(15, 23, 42, 0.92))",
    border: "1px solid rgba(34, 197, 94, 0.24)",
    borderRadius: "22px",
    padding: "28px",
    marginBottom: "24px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
    flexWrap: "wrap",
  },

  heroEyebrow: {
    margin: "0 0 8px 0",
    color: "#86efac",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "800",
  },

  heroTitle: {
    margin: "0 0 12px 0",
    fontSize: "32px",
    fontWeight: "900",
    maxWidth: "780px",
  },

  heroText: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.6,
    maxWidth: "760px",
  },

  heroBadge: {
    minWidth: "150px",
    minHeight: "150px",
    borderRadius: "999px",
    border: "1px solid rgba(34, 197, 94, 0.35)",
    background: "rgba(15, 23, 42, 0.78)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  heroBadgeNumber: {
    fontSize: "44px",
    fontWeight: "900",
    color: "#4ade80",
  },

  heroBadgeLabel: {
    color: "#cbd5e1",
    fontSize: "13px",
    textTransform: "uppercase",
    fontWeight: "800",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  metricCard: {
  background: "rgba(15, 23, 42, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.14)",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "150px",
  transition: "all 0.2s ease",
  },

  metricLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },

  metricValue: {
    margin: "12px 0 8px 0",
    fontSize: "36px",
    fontWeight: "800",
    color: "#f8fafc",
  },

  metricDescription: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "16px",
  },

  panelCard: {
  background: "rgba(15, 23, 42, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.14)",
  borderRadius: "18px",
  padding: "24px",
  paddingBottom: "32px",
  boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
  minHeight: "320px",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  panelEyebrow: {
    margin: "0 0 6px 0",
    color: "#94a3b8",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
  },

  rankingList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  rankingItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },

  rankingPosition: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    background: "#22c55e",
    color: "#052e16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  rankingName: {
    margin: "0 0 4px 0",
    color: "#f8fafc",
    fontWeight: "800",
  },

  rankingMeta: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },

  activityTitle: {
    margin: "0 0 4px 0",
    color: "#f8fafc",
    fontWeight: "800",
  },

  activityMeta: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  statusCompleted: {
    padding: "8px 10px",
    borderRadius: "999px",
    background: "rgba(34, 197, 94, 0.16)",
    color: "#4ade80",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  statusPending: {
    padding: "8px 10px",
    borderRadius: "999px",
    background: "rgba(234, 179, 8, 0.16)",
    color: "#facc15",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  emptyText: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: 1.5,
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

  errorText: {
    margin: 0,
    color: "#f87171",
  },
};
