export function createResponsiveGrid({
  min = 220,
  gap = 16,
} = {}) {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
    gap: `${gap}px`,
  };
}