export function buildGridColumns({
  minWidth = 280,
  max = "1fr",
} = {}) {
  return `repeat(auto-fit, minmax(${minWidth}px, ${max}))`;
}

export function px(value) {
  return `${value}px`;
}
