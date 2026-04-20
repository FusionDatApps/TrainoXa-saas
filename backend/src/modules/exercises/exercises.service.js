const { prisma } = require("../../config/prisma");

async function getAuthenticatedTrainerProfile(authUser) {
  if (!authUser || !authUser.id) {
    const error = new Error("Usuario inválido");
    error.statusCode = 401;
    throw error;
  }

  if (authUser.role !== "TRAINER") {
    const error = new Error("Solo trainers pueden acceder");
    error.statusCode = 403;
    throw error;
  }

  const trainer = await prisma.trainerProfile.findUnique({
    where: {
      userId: authUser.id,
    },
  });

  if (!trainer) {
    const error = new Error("Trainer profile no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return trainer;
}

async function createExercise(authUser, data) {
  const trainer = await getAuthenticatedTrainerProfile(authUser);

  const exercise = await prisma.exercise.create({
    data: {
      trainerId: trainer.id,
      ...data,
    },
  });

  return exercise;
}

async function getExercises(authUser) {
  const trainer = await getAuthenticatedTrainerProfile(authUser);

  return prisma.exercise.findMany({
    where: {
      trainerId: trainer.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getExerciseById(authUser, exerciseId) {
  const trainer = await getAuthenticatedTrainerProfile(authUser);

  const exercise = await prisma.exercise.findFirst({
    where: {
      id: exerciseId,
      trainerId: trainer.id,
    },
  });

  if (!exercise) {
    const error = new Error("Ejercicio no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return exercise;
}

module.exports = {
  createExercise,
  getExercises,
  getExerciseById,
};