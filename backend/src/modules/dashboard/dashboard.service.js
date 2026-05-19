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
    totalCompletados,
    volumenAgregado,
    clientesConActividad,
    ultimoProgreso,
    ejerciciosMasUsados,
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

    prisma.progressLog.count({
      where: {
        completed: true,
        assignment: {
          trainerId: trainer.id,
        },
      },
    }),

    prisma.progressLog.aggregate({
      where: {
        assignment: {
          trainerId: trainer.id,
        },
      },
      _sum: {
        weightUsedKg: true,
      },
    }),

    prisma.clientAssignment.findMany({
      where: {
        trainerId: trainer.id,
        progressLogs: {
          some: {},
        },
      },
      distinct: ["clientId"],
      select: {
        clientId: true,
      },
    }),

    prisma.progressLog.findFirst({
      where: {
        assignment: {
          trainerId: trainer.id,
        },
      },
      orderBy: {
        performedAt: "desc",
      },
      select: {
        performedAt: true,
      },
    }),

    prisma.progressLog.groupBy({
      by: ["exerciseId"],
      where: {
        assignment: {
          trainerId: trainer.id,
        },
      },
      _count: {
        exerciseId: true,
      },
      orderBy: {
        _count: {
          exerciseId: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const ejerciciosIds = ejerciciosMasUsados.map((item) => item.exerciseId);

  const ejercicios = ejerciciosIds.length
    ? await prisma.exercise.findMany({
        where: {
          id: {
            in: ejerciciosIds,
          },
        },
      })
    : [];

  const ejerciciosMasUsadosConNombre = ejerciciosMasUsados.map((item) => {
    const exercise = ejercicios.find(
      (current) => current.id === item.exerciseId
    );

    return {
      exerciseId: item.exerciseId,
      name: exercise?.name || "Ejercicio sin nombre",
      total: item._count.exerciseId,
    };
  });

  return {
    totalClientes,
    totalEjercicios,
    totalRutinas,
    totalAsignacionesActivas,
    totalProgreso,
    totalCompletados,
    volumenTotalKg: volumenAgregado._sum.weightUsedKg || 0,
    clientesConActividad: clientesConActividad.length,
    ultimoProgresoAt: ultimoProgreso?.performedAt || null,
    ejerciciosMasUsados: ejerciciosMasUsadosConNombre,
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
