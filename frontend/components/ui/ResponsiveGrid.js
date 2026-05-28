"use client";

import { createResponsiveGrid } from "../../lib/responsive-helpers";

export default function ResponsiveGrid({
  children,
  min = 220,
  gap = 16,
  style = {},
}) {
  return (
    <section
      style={{
        ...createResponsiveGrid({ min, gap }),
        ...style,
      }}
    >
      {children}
    </section>
  );
}