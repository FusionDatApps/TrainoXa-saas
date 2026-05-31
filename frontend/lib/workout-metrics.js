export function buildWorkoutMetrics({
  workouts = [],
  workoutExercises = {},
}) {
  const totalWorkouts = workouts.length;

  const activeWorkouts = workouts.filter(
    (workout) => workout.isActive
  ).length;

  const inactiveWorkouts =
    totalWorkouts - activeWorkouts;

  const totalExercises = Object.values(
    workoutExercises
  ).reduce((total, items) => {
    return total + (items?.length || 0);
  }, 0);

  const averageExercisesPerWorkout =
    totalWorkouts > 0
      ? (totalExercises / totalWorkouts).toFixed(1)
      : "0.0";

  const mostLoadedWorkout = workouts.reduce(
    (current, workout) => {
      const count =
        workoutExercises[workout.id]?.length || 0;

      if (count > current.count) {
        return {
          name: workout.name,
          count,
        };
      }

      return current;
    },
    {
      name: "Sin datos",
      count: 0,
    }
  );

  return {
    totalWorkouts,
    activeWorkouts,
    inactiveWorkouts,
    totalExercises,
    averageExercisesPerWorkout,
    mostLoadedWorkout,
  };
}
