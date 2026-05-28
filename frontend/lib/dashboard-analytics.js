export function calculateProgressTrend(
  recentActivity = []
) {
  const grouped = {};

  recentActivity.forEach((item) => {
    if (!item?.performedAt) {
      return;
    }

    const date = new Date(
      item.performedAt
    ).toLocaleDateString();

    if (!grouped[date]) {
      grouped[date] = {
        completed: 0,
        total: 0,
      };
    }

    grouped[date].total += 1;

    if (item.completed) {
      grouped[date].completed += 1;
    }
  });

  return Object.entries(grouped)
    .map(([date, values]) => ({
      date,

      completed: values.completed,

      total: values.total,

      percentage:
        values.total === 0
          ? 0
          : Math.round(
              (values.completed /
                values.total) *
                100
            ),
    }))
    .slice(-7);
}

export function calculateTopClients(
  recentActivity = []
) {
  const grouped = {};

  recentActivity.forEach((item) => {
    const client =
      item.assignment?.client;

    if (!client?.id) {
      return;
    }

    if (!grouped[client.id]) {
      grouped[client.id] = {
        id: client.id,
        fullName:
          client.fullName ||
          "Cliente sin nombre",
        total: 0,
      };
    }

    grouped[client.id].total += 1;
  });

  return Object.values(grouped)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

export function calculateWorkoutVolume(
  recentActivity = []
) {
  return recentActivity.reduce(
    (acc, item) => {
      const weight =
        Number(item.weightUsedKg) || 0;

      return acc + weight;
    },
    0
  );
}