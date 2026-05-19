const { prisma } = require("../../config/prisma");

async function getTrainerProfile(authUser) {
  if (!authUser || !authUser.id) {
    throw new Error("Usuario inválido");
  }

  if (authUser.role !== "TRAINER") {
    throw new Error("Solo trainers pueden registrar progreso");
  }

  const trainer = await prisma.trainerProfile.findUnique({
    where: { userId: authUser.id },
  });

  if (!trainer) {
    throw new Error("Trainer profile no encontrado");
  }

  return trainer;
}

async function createProgress({ authUser, data }) {
  const trainer = await getTrainerProfile(authUser);

  const assignment = await prisma.clientAssignment.findFirst({
    where: {
      id: data.assignmentId,
      trainerId: trainer.id,
    },
    include: {
      workoutPlan: {
        include: {
          exercises: true,
        },
      },
    },
  });

  if (!assignment) {
    const error = new Error("Asignación no encontrada o no pertenece al trainer");
    error.statusCode = 404;
    throw error;
  }

  if (!assignment.isActive) {
    const error = new Error(
      "No puedes registrar progreso sobre una asignación inactiva"
    );
    error.statusCode = 409;
    throw error;
  }

  const exercise = await prisma.exercise.findFirst({
    where: {
      id: data.exerciseId,
      trainerId: trainer.id,
    },
  });

  if (!exercise) {
    const error = new Error("Ejercicio no encontrado o no pertenece al trainer");
    error.statusCode = 404;
    throw error;
  }

  const existsInWorkout = assignment.workoutPlan.exercises.find(
    (item) => item.exerciseId === data.exerciseId
  );

  if (!existsInWorkout) {
    const error = new Error("El ejercicio no pertenece a la rutina asignada");
    error.statusCode = 400;
    throw error;
  }

  return prisma.progressLog.create({
    data: {
      assignmentId: data.assignmentId,
      exerciseId: data.exerciseId,
      performedAt: data.performedAt ? new Date(data.performedAt) : undefined,
      repsCompleted: data.repsCompleted,
      weightUsedKg: data.weightUsedKg,
      completed: data.completed ?? false,
      notes: data.notes,
    },
  });
}

async function getProgressByAssignment({ authUser, assignmentId }) {
  const trainer = await getTrainerProfile(authUser);

  const assignment = await prisma.clientAssignment.findFirst({
    where: {
      id: assignmentId,
      trainerId: trainer.id,
    },
  });

  if (!assignment) {
    const error = new Error("Asignación no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return prisma.progressLog.findMany({
    where: {
      assignmentId,
    },
    include: {
      exercise: true,
    },
    orderBy: {
      performedAt: "desc",
    },
  });
}

module.exports = {
  createProgress,
  getProgressByAssignment,
};
