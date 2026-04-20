const { prisma } = require("../../config/prisma");

async function getAuthenticatedTrainerProfile(authUser) {
  if (!authUser || !authUser.id) {
    const error = new Error("Usuario autenticado inválido");
    error.statusCode = 401;
    throw error;
  }

  if (authUser.role !== "TRAINER") {
    const error = new Error("Acceso solo permitido para entrenadores");
    error.statusCode = 403;
    throw error;
  }

  const trainerProfile = await prisma.trainerProfile.findUnique({
    where: {
      userId: authUser.id,
    },
  });

  if (!trainerProfile) {
    const error = new Error("Perfil de entrenador no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return trainerProfile;
}

async function createWorkout({ authUser, name, description }) {
  const trainerProfile = await getAuthenticatedTrainerProfile(authUser);

  return prisma.workoutPlan.create({
    data: {
      trainerId: trainerProfile.id,
      name,
      description,
    },
  });
}

async function getWorkouts(authUser) {
  const trainerProfile = await getAuthenticatedTrainerProfile(authUser);

  return prisma.workoutPlan.findMany({
    where: {
      trainerId: trainerProfile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getWorkoutById({ authUser, workoutId }) {
  const trainerProfile = await getAuthenticatedTrainerProfile(authUser);

  return prisma.workoutPlan.findFirst({
    where: {
      id: workoutId,
      trainerId: trainerProfile.id,
    },
  });
}

async function addExerciseToWorkout({ authUser, workoutId, data }) {
  const trainerProfile = await getAuthenticatedTrainerProfile(authUser);

  const workout = await prisma.workoutPlan.findFirst({
    where: {
      id: workoutId,
      trainerId: trainerProfile.id,
    },
  });

  if (!workout) {
    const error = new Error("Rutina no encontrada");
    error.statusCode = 404;
    throw error;
  }

  const exercise = await prisma.exercise.findFirst({
    where: {
      id: data.exerciseId,
      trainerId: trainerProfile.id,
    },
  });

  if (!exercise) {
    const error = new Error("Ejercicio no encontrado o no pertenece al entrenador");
    error.statusCode = 404;
    throw error;
  }

  return prisma.workoutPlanExercise.create({
    data: {
      workoutPlanId: workoutId,
      exerciseId: data.exerciseId,
      exerciseOrder: data.exerciseOrder,
      sets: data.sets,
      reps: data.reps,
      restSeconds: data.restSeconds,
      notes: data.notes,
    },
  });
}

async function getWorkoutExercises({ authUser, workoutId }) {
  const trainerProfile = await getAuthenticatedTrainerProfile(authUser);

  const workout = await prisma.workoutPlan.findFirst({
    where: {
      id: workoutId,
      trainerId: trainerProfile.id,
    },
  });

  if (!workout) {
    const error = new Error("Rutina no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return prisma.workoutPlanExercise.findMany({
    where: {
      workoutPlanId: workoutId,
    },
    include: {
      exercise: true,
    },
    orderBy: {
      exerciseOrder: "asc",
    },
  });
}

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  addExerciseToWorkout,
  getWorkoutExercises,
};