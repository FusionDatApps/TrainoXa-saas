"use client";

import Badge from "./Badge";

const STATUS_CONFIG = {
  idle: null,

  saving: {
    label: "Guardando...",
    variant: "warning",
  },

  syncing: {
    label: "Sincronizando...",
    variant: "warning",
  },

  saved: {
    label: "Guardado",
    variant: "success",
  },

  success: {
    label: "Completado",
    variant: "success",
  },

  error: {
    label: "Error",
    variant: "danger",
  },
};

export default function AsyncStatusBadge({
  status = "idle",
  label,
}) {
  const config =
    STATUS_CONFIG[status];

  if (!config && !label) {
    return null;
  }

  return (
    <Badge
      variant={
        config?.variant ||
        "default"
      }
    >
      {label ||
        config?.label ||
        status}
    </Badge>
  );
}