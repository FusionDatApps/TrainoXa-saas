"use client";

import { useEffect, useMemo, useState } from "react";

import TrainerShell from "../../components/TrainerShell";

import SectionCard from "../../components/ui/SectionCard";
import EmptyState from "../../components/ui/EmptyState";
import ResponsiveGrid from "../../components/ui/ResponsiveGrid";

import ContentStack from "../../components/ui/ContentStack";
import InlineGroup from "../../components/ui/InlineGroup";
import PageHeader from "../../components/ui/PageHeader";
import PageSection from "../../components/ui/PageSection";
import SectionTitle from "../../components/ui/SectionTitle";

import DashboardGrid from "../../components/dashboard/DashboardGrid";
import KpiCard from "../../components/dashboard/KpiCard";
import RecentActivityList from "../../components/dashboard/RecentActivityList";

import ProgressTrendCard from "../../components/dashboard/ProgressTrendCard";
import TopClientsCard from "../../components/dashboard/TopClientsCard";
import WorkoutVolumeCard from "../../components/dashboard/WorkoutVolumeCard";

import CompletionRateChart from "../../components/dashboard/CompletionRateChart";
import ActivityBarChart from "../../components/dashboard/ActivityBarChart";
import MetricTrendCard from "../../components/dashboard/MetricTrendCard";

import SkeletonCard from "../../components/ui/SkeletonCard";
import EmptyDashboardState from "../../components/ui/EmptyDashboardState";
import QuickActionCard from "../../components/ui/QuickActionCard";

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

import { theme } from "../../lib/theme";

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

  const hasData =
    metrics.some(
      (metric) =>
        Number(metric.value) > 0
    ) || recentActivity.length > 0;

  return (
    <TrainerShell
      title="Dashboard"
      active="dashboard"
    >
      <ContentStack gap={24}>
        {loading ? (
          <>
            <ResponsiveGrid
              min={220}
              gap={16}
            >
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <SkeletonCard
                  key={index}
                  height={150}
                />
              ))}
            </ResponsiveGrid>

            <ResponsiveGrid
              min={320}
              gap={16}
            >
              <SkeletonCard
                height={240}
              />

              <SkeletonCard
                height={240}
              />
            </ResponsiveGrid>
          </>
        ) : null}

        {!loading && error ? (
          <SectionCard>
            <span style={styles.errorText}>
              {error}
            </span>
          </SectionCard>
        ) : null}

        {!loading &&
        !error &&
        !hasData ? (
          <EmptyDashboardState />
        ) : null}

        {!loading &&
        !error &&
        hasData ? (
          <>
            <PageSection>
              <section style={styles.heroCard}>
                <PageHeader
                  eyebrow="Resumen del negocio fitness"
                  title="Control operativo y progreso real de tus clientes"
                  description="Este panel centraliza clientes, rutinas, asignaciones, volumen de entrenamiento y actividad reciente del sistema."
                />

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
            </PageSection>

            <PageSection>
              <PageHeader
                eyebrow="Acciones rápidas"
                title="Flujo operativo rápido"
                description="Accede rápidamente a las tareas principales del sistema."
              />

              <ResponsiveGrid
                min={260}
                gap={16}
              >
                <QuickActionCard
                  title="Crear cliente"
                  description="Registra nuevos clientes fitness dentro de la plataforma."
                  href="/clients"
                  accent="#22c55e"
                />

                <QuickActionCard
                  title="Crear rutina"
                  description="Diseña nuevos planes de entrenamiento personalizados."
                  href="/workouts"
                  accent="#38bdf8"
                />

                <QuickActionCard
                  title="Registrar progreso"
                  description="Actualiza el rendimiento real de tus clientes."
                  href="/progress"
                  accent="#a855f7"
                />
              </ResponsiveGrid>
            </PageSection>

            <PageSection>
              <ResponsiveGrid
                min={320}
                gap={16}
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
            </PageSection>

            <PageSection>
              <DashboardGrid>
                <SectionCard>
                  <ContentStack gap={18}>
                    <SectionTitle
                      eyebrow="Ranking"
                      title="Ejercicios más usados"
                    />

                    {summary?.ejerciciosMasUsados
                      ?.length > 0 ? (
                      <ContentStack gap={12}>
                        {summary.ejerciciosMasUsados.map(
                          (
                            exercise,
                            index
                          ) => (
                            <InlineGroup
                              key={
                                exercise.exerciseId
                              }
                              justify="space-between"
                              style={
                                styles.rankingItem
                              }
                            >
                              <InlineGroup gap={14}>
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
                              </InlineGroup>
                            </InlineGroup>
                          )
                        )}
                      </ContentStack>
                    ) : (
                      <EmptyState>
                        Todavía no hay
                        ejercicios con
                        progreso registrado.
                      </EmptyState>
                    )}
                  </ContentStack>
                </SectionCard>

                <SectionCard>
                  <ContentStack gap={18}>
                    <SectionTitle
                      eyebrow="Actividad"
                      title="Últimos registros"
                    />

                    <RecentActivityList
                      items={recentActivity}
                    />
                  </ContentStack>
                </SectionCard>
              </DashboardGrid>
            </PageSection>
          </>
        ) : null}
      </ContentStack>
    </TrainerShell>
  );
}

const styles = {
  heroCard: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    gap: theme.spacing.lg,

    background:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(15, 23, 42, 0.92))",

    border:
      "1px solid rgba(34, 197, 94, 0.24)",

    borderRadius:
      theme.radius.lg,

    padding: "28px",

    boxShadow:
      theme.shadows.elevated,

    flexWrap: "wrap",
  },

  heroBadge: {
    minWidth: "150px",

    minHeight: "150px",

    borderRadius:
      theme.radius.full,

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

    color:
      theme.colors.success,
  },

  heroBadgeLabel: {
    color:
      theme.colors.textSecondary,

    fontSize: "13px",

    textTransform: "uppercase",

    fontWeight: "800",
  },

  rankingItem: {
    padding: "14px",

    borderRadius:
      theme.radius.sm,

    background:
      theme.colors.surface,

    border: `1px solid ${theme.colors.border}`,
  },

  rankingPosition: {
    width: "34px",

    height: "34px",

    borderRadius:
      theme.radius.full,

    background:
      theme.colors.success,

    color:
      theme.colors.successDark,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontWeight: "900",
  },

  rankingName: {
    margin: "0 0 4px 0",

    color:
      theme.colors.textPrimary,

    fontWeight: "800",
  },

  rankingMeta: {
    margin: 0,

    color:
      theme.colors.textMuted,

    fontSize: "13px",
  },

  errorText: {
    color:
      theme.colors.danger,
  },
};