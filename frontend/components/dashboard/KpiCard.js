"use client";

import StatCard from "../ui/StatCard";

export default function KpiCard({
  label,
  value,
  description,
}) {
  return (
    <StatCard
      label={label}
      value={value}
      description={description}
    />
  );
}