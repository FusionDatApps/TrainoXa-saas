export function normalizeChartValues(
  values = [],
  maxHeight = 120
) {
  const max = Math.max(
    ...values.map((item) => item.value),
    1
  );

  return values.map((item) => ({
    ...item,

    height: Math.max(
      (item.value / max) * maxHeight,
      8
    ),
  }));
}