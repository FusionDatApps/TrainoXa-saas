"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

export default function AnimatedCounter({
  value = 0,
  duration = 900,
  formatter,
}) {
  const numericValue = useMemo(() => {
    const parsed = Number(value);

    return Number.isNaN(parsed)
      ? 0
      : parsed;
  }, [value]);

  const [displayValue, setDisplayValue] =
    useState(0);

  useEffect(() => {
    let frame;

    const start =
      performance.now();

    function update(now) {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      const current = Math.round(
        numericValue * eased
      );

      setDisplayValue(current);

      if (progress < 1) {
        frame =
          requestAnimationFrame(
            update
          );
      }
    }

    frame =
      requestAnimationFrame(update);

    return () =>
      cancelAnimationFrame(frame);
  }, [numericValue, duration]);

  if (formatter) {
    return formatter(displayValue);
  }

  return displayValue;
}