"use client";

import EmptyState from "./EmptyState";

export default function EmptyDashboardState({
  title = "Todavia no hay datos",
  description = "Comienza creando clientes, rutinas y asignaciones para visualizar metricas reales.",
  actionLabel,
  onAction,
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon="▣"
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}
