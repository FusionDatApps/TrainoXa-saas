"use client";

import MetricCard from "../ui/MetricCard";

export default function WorkoutVolumeCard({
  totalKg = 0,
}) {
  return (
    <MetricCard
      label="Volumen reciente"
      value={`${totalKg} kg`}
      description="Peso total registrado recientemente en entrenamientos."
    />
  );
}