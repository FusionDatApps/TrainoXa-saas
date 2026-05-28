"use client";

import MetricCard from "../ui/MetricCard";

export default function KpiCard({
  label,
  value,
  description,
}) {
  return (
    <MetricCard
      label={label}
      value={value}
      description={description}
    />
  );
}