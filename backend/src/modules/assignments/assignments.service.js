const { prisma } = require("../../config/prisma");

async function getTrainerProfile(authUser) {
  if (!authUser || !authUser.id) {
    throw new Error("Usuario inválido");
  }

  if (authUser.role !== "TRAINER") {
    throw new Error("Solo trainers pueden asignar rutinas");
  }

  const trainer = await prisma.trainerProfile.findUnique({
    where: { userId: authUser.id },
  });

  if (!trainer) {
    throw new Error("Trainer profile no encontrado");
  }

  return trainer;
}

async function createAssignment({ authUser, data }) {
  const trainer = await getTrainerProfile(authUser);

  const client = await prisma.clientProfile.findFirst({
    where: {
      id: data.clientId,
      trainerId: trainer.id,
    },
  });

  if (!client) {
    const error = new Error("Cliente no encontrado o no pertenece al trainer");
    error.statusCode = 404;
    throw error;
  }

  const workout = await prisma.workoutPlan.findFirst({
    where: {
      id: data.workoutPlanId,
      trainerId: trainer.id,
    },
  });

  if (!workout) {
    const error = new Error("Rutina no encontrada o no pertenece al trainer");
    error.statusCode = 404;
    throw error;
  }

  const existingAssignment = await prisma.clientAssignment.findFirst({
    where: {
      trainerId: trainer.id,
      clientId: data.clientId,
      workoutPlanId: data.workoutPlanId,
      isActive: true,
    },
  });

  if (existingAssignment) {
    const error = new Error("El cliente ya tiene esta rutina asignada");
    error.statusCode = 409;
    throw error;
  }

  return prisma.clientAssignment.create({
    data: {
      trainerId: trainer.id,
      clientId: data.clientId,
      workoutPlanId: data.workoutPlanId,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
}

async function getAssignments(authUser) {
  const trainer = await getTrainerProfile(authUser);

  return prisma.clientAssignment.findMany({
    where: {
      trainerId: trainer.id,
    },
    include: {
      client: true,
      workoutPlan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getAssignmentById({ authUser, assignmentId }) {
  const trainer = await getTrainerProfile(authUser);

  const assignment = await prisma.clientAssignment.findFirst({
    where: {
      id: assignmentId,
      trainerId: trainer.id,
    },
    include: {
      client: true,
      workoutPlan: true,
    },
  });

  if (!assignment) {
    const error = new Error("Asignación no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return assignment;
}

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
};