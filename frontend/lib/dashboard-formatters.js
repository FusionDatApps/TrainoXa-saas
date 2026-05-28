export function formatPercentage(value) {
  return `${value || 0}%`;
}

export function formatKg(value) {
  return `${value || 0} kg`;
}

export function formatDateTime(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Date(value).toLocaleString();
}

export function pluralize(value, singular, plural) {
  return `${value} ${
    value === 1 ? singular : plural
  }`;
}