"use client";

import { useEffect, useMemo, useState } from "react";

import TrainerShell from "../../components/TrainerShell";

import SectionCard from "../../components/ui/SectionCard";
import EmptyState from "../../components/ui/EmptyState";
import LoadingCard from "../../components/ui/LoadingCard";
import ResponsiveGrid from "../../components/ui/ResponsiveGrid";

import DashboardGrid from "../../components/dashboard/DashboardGrid";
import KpiCard from "../../components/dashboard/KpiCard";
import RecentActivityList from "../../components/dashboard/RecentActivityList";

import ProgressTrendCard from "../../components/dashboard/ProgressTrendCard";
import TopClientsCard from "../../components/dashboard/TopClientsCard";
import WorkoutVolumeCard from "../../components/dashboard/WorkoutVolumeCard";

import CompletionRateChart from "../../components/dashboard/CompletionRateChart";
import ActivityBarChart from "../../components/dashboard/ActivityBarChart";
import MetricTrendCard from "../../components/dashboard/MetricTrendCard";

import {
  formatKg,
  formatPercentage,
  pluralize,
} from "../../lib/dashboard-formatters";

import {
  calculateProgressTrend,
  calculateTopClients,
  calculateWorkoutVolume,
} from "../../lib/dashboard-analytics";

import { apiFetch } from "../../lib/api";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [summary, setSummary] =
    useState(null);

  const [recentActivity, setRecentActivity] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [summaryRes, activityRes] =
        await Promise.all([
          apiFetch("/dashboard/summary"),

          apiFetch(
            "/dashboard/recent-activity"
          ),
        ]);

      setSummary(summaryRes.data || {});
      setRecentActivity(
        activityRes.data || []
      );
    } catch (err) {
      setError(
        err.message ||
          "No se pudo cargar el dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const completionRate = useMemo(() => {
    const total =
      summary?.totalProgreso || 0;

    const completed =
      summary?.totalCompletados || 0;

    if (total === 0) {
      return 0;
    }

    return Math.round(
      (completed / total) * 100
    );
  }, [summary]);

  const progressTrend = useMemo(() => {
    return calculateProgressTrend(
      recentActivity
    );
  }, [recentActivity]);

  const topClients = useMemo(() => {
    return calculateTopClients(
      recentActivity
    );
  }, [recentActivity]);

  const recentVolume = useMemo(() => {
    return calculateWorkoutVolume(
      recentActivity
    );
  }, [recentActivity]);

  const metrics = [
    {
      label: "Clientes",

      value:
        summary?.totalClientes ?? 0,

      description:
        "Clientes registrados por el trainer",
    },

    {
      label: "Rutinas",

      value:
        summary?.totalRutinas ?? 0,

      description:
        "Planes de entrenamiento creados",
    },

    {
      label: "Asignaciones activas",

      value:
        summary?.totalAsignacionesActivas ??
        0,

      description:
        "Rutinas actualmente asignadas",
    },

    {
      label: "Registros de progreso",

      value:
        summary?.totalProgreso ?? 0,

      description:
        "Entrenamientos reportados",
    },

    {
      label: "Ejercicios completados",

      value:
        summary?.totalCompletados ?? 0,

      description:
        "Registros marcados como completados",
    },

    {
      label: "Volumen total",

      value: formatKg(
        summary?.volumenTotalKg
      ),

      description:
        "Suma total de peso registrado",
    },

    {
      label: "Clientes con actividad",

      value:
        summary?.clientesConActividad ??
        0,

      description:
        "Clientes con progreso registrado",
    },

    {
      label: "Cumplimiento",

      value: formatPercentage(
        completionRate
      ),

      description:
        "Porcentaje global de ejercicios completados",
    },
  ];

  return (
    <TrainerShell
      title="Dashboard"
      active="dashboard"
    >
      {loading ? (
        <LoadingCard>
          Cargando resumen del
          dashboard...
        </LoadingCard>
      ) : null}

      {!loading && error ? (
        <LoadingCard>
          <span style={styles.errorText}>
            {error}
          </span>
        </LoadingCard>
      ) : null}

      {!loading && !error ? (
        <>
          <section style={styles.heroCard}>
            <div>
              <p style={styles.heroEyebrow}>
                Resumen del negocio
                fitness
              </p>

              <h2 style={styles.heroTitle}>
                Control operativo y
                progreso real de tus
                clientes
              </h2>

              <p style={styles.heroText}>
                Este panel centraliza
                clientes, rutinas,
                asignaciones, volumen de
                entrenamiento y actividad
                reciente del sistema.
              </p>
            </div>

            <div style={styles.heroBadge}>
              <span
                style={
                  styles.heroBadgeNumber
                }
              >
                {formatPercentage(
                  completionRate
                )}
              </span>

              <span
                style={
                  styles.heroBadgeLabel
                }
              >
                cumplimiento
              </span>
            </div>
          </section>

          <ResponsiveGrid
            min={220}
            gap={16}
            style={styles.sectionSpacing}
          >
            {metrics.map((item) => (
              <KpiCard
                key={item.label}
                label={item.label}
                value={item.value}
                description={
                  item.description
                }
              />
            ))}
          </ResponsiveGrid>

          <ResponsiveGrid
            min={320}
            gap={16}
            style={styles.sectionSpacing}
          >
            <MetricTrendCard
              title="Cumplimiento"
              value={formatPercentage(
                completionRate
              )}
              description="Porcentaje global de ejercicios completados correctamente."
            >
              <CompletionRateChart
                percentage={
                  completionRate
                }
              />
            </MetricTrendCard>

            <MetricTrendCard
              title="Actividad reciente"
              value={
                progressTrend.length
              }
              description="Distribución reciente de registros de entrenamiento."
            >
              <ActivityBarChart
                items={progressTrend}
              />
            </MetricTrendCard>
          </ResponsiveGrid>

          <ResponsiveGrid
            min={280}
            gap={16}
            style={styles.sectionSpacing}
          >
            <ProgressTrendCard
              items={progressTrend}
            />

            <TopClientsCard
              clients={topClients}
            />

            <WorkoutVolumeCard
              totalKg={recentVolume}
            />
          </ResponsiveGrid>

          <DashboardGrid>
            <SectionCard>
              <div style={styles.panelHeader}>
                <div>
                  <p
                    style={
                      styles.panelEyebrow
                    }
                  >
                    Ranking
                  </p>

                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    Ejercicios más usados
                  </h2>
                </div>
              </div>

              {summary?.ejerciciosMasUsados
                ?.length > 0 ? (
                <div style={styles.rankingList}>
                  {summary.ejerciciosMasUsados.map(
                    (
                      exercise,
                      index
                    ) => (
                      <div
                        key={
                          exercise.exerciseId
                        }
                        style={
                          styles.rankingItem
                        }
                      >
                        <span
                          style={
                            styles.rankingPosition
                          }
                        >
                          {index + 1}
                        </span>

                        <div>
                          <p
                            style={
                              styles.rankingName
                            }
                          >
                            {
                              exercise.name
                            }
                          </p>

                          <p
                            style={
                              styles.rankingMeta
                            }
                          >
                            {pluralize(
                              exercise.total,
                              "registro",
                              "registros"
                            )}{" "}
                            de progreso
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <EmptyState>
                  Todavía no hay
                  ejercicios con progreso
                  registrado.
                </EmptyState>
              )}
            </SectionCard>

            <SectionCard>
              <div style={styles.panelHeader}>
                <div>
                  <p
                    style={
                      styles.panelEyebrow
                    }
                  >
                    Actividad
                  </p>

                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    Últimos registros
                  </h2>
                </div>
              </div>

              <RecentActivityList
                items={recentActivity}
              />
            </SectionCard>
          </DashboardGrid>
        </>
      ) : null}
    </TrainerShell>
  );
}

const styles = {
  heroCard: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    gap: "24px",

    background:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(15, 23, 42, 0.92))",

    border:
      "1px solid rgba(34, 197, 94, 0.24)",

    borderRadius: "22px",

    padding: "28px",

    marginBottom: "24px",

    boxShadow:
      "0 14px 30px rgba(0, 0, 0, 0.22)",

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

    border:
      "1px solid rgba(34, 197, 94, 0.35)",

    background:
      "rgba(15, 23, 42, 0.78)",

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

  sectionSpacing: {
    marginBottom: "24px",
  },

  panelHeader: {
    display: "flex",

    justifyContent:
      "space-between",

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

    background:
      "rgba(15, 23, 42, 0.9)",

    border:
      "1px solid rgba(148, 163, 184, 0.12)",
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

  errorText: {
    color: "#f87171",
  },
};