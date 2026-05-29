"use client";

import MetricCard from "../ui/MetricCard";
import AnimatedCounter from "../ui/AnimatedCounter";

export default function KpiCard({
  label,
  value,
  description,
}) {
  const numericValue = Number(
    String(value).replace(/[^\d.-]/g, "")
  );

  const isNumeric =
    !Number.isNaN(numericValue);

  return (
    <MetricCard
      label={label}
      value={
        isNumeric ? (
          <AnimatedCounter
            value={numericValue}
            formatter={(val) => {
              if (
                typeof value ===
                "string"
              ) {
                return String(
                  value
                ).replace(
                  String(
                    numericValue
                  ),
                  String(val)
                );
              }

              return val;
            }}
          />
        ) : (
          value
        )
      }
      description={description}
    />
  );
}