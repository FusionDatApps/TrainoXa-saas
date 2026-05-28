"use client";

import StatCard from "../ui/StatCard";

export default function WorkoutVolumeCard({
  totalKg = 0,
}) {
  return (
    <StatCard
      label="Volumen reciente"
      value={`${totalKg} kg`}
      description="Peso total registrado recientemente en entrenamientos."
    />
  );
}