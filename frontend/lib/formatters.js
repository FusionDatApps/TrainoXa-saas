export function formatDate(date) {
  if (!date) {
    return "Sin fecha";
  }

  return new Date(date).toLocaleString();
}

export function formatWeight(value) {
  if (value === null || value === undefined) {
    return "0 kg";
  }

  return `${value} kg`;
}

export function formatPercentage(value) {
  if (value === null || value === undefined) {
    return "0%";
  }

  return `${value}%`;
}