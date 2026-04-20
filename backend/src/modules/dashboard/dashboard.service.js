const { prisma } = require("../../config/prisma");

async function getTrainerProfile(authUser) {
  if (!authUser || !authUser.id) {
    throw new Error("Usuario inválido");
  }

  if (authUser.role !== "TRAINER") {
    throw new Error("Solo trainers pueden acceder al dashboard");
  }

  const trainer = await prisma.trainerProfile.findUnique({
    where: { userId: authUser.id },
  });

  if (!trainer) {
    throw new Error("Trainer profile no encontrado");
  }

  return trainer;
}

async function getSummary(authUser) {
  const trainer = await getTrainerProfile(authUser);

  const [
    totalClientes,
    totalEjercicios,
    totalRutinas,
    totalAsignacionesActivas,
    totalProgreso,
  ] = await Promise.all([
    prisma.clientProfile.count({
      where: { trainerId: trainer.id },
    }),
    prisma.exercise.count({
      where: { trainerId: trainer.id },
    }),
    prisma.workoutPlan.count({
      where: { trainerId: trainer.id },
    }),
    prisma.clientAssignment.count({
      where: {
        trainerId: trainer.id,
        isActive: true,
      },
    }),
    prisma.progressLog.count({
      where: {
        assignment: {
          trainerId: trainer.id,
        },
      },
    }),
  ]);

  return {
    totalClientes,
    totalEjercicios,
    totalRutinas,
    totalAsignacionesActivas,
    totalProgreso,
  };
}

async function getRecentActivity(authUser) {
  const trainer = await getTrainerProfile(authUser);

  return prisma.progressLog.findMany({
    where: {
      assignment: {
        trainerId: trainer.id,
      },
    },
    include: {
      exercise: true,
      assignment: {
        include: {
          client: true,
        },
      },
    },
    orderBy: {
      performedAt: "desc",
    },
    take: 10,
  });
}

module.exports = {
  getSummary,
  getRecentActivity,
};