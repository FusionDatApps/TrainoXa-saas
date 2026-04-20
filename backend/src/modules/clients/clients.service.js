const bcrypt = require("bcrypt");
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

async function createClient(authUser, data) {
  const trainerProfile = await getAuthenticatedTrainerProfile(authUser);
  const { email, password, fullName, ...rest } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("Ya existe un usuario con ese email");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "CLIENT",
      clientProfile: {
        create: {
          fullName,
          trainerId: trainerProfile.id,
          ...rest,
        },
      },
    },
    include: {
      clientProfile: true,
    },
  });

  return {
    id: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
    clientProfile: createdUser.clientProfile,
  };
}

async function getClients(authUser) {
  const trainerProfile = await getAuthenticatedTrainerProfile(authUser);

  return prisma.clientProfile.findMany({
    where: {
      trainerId: trainerProfile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getClientById(authUser, clientId) {
  const trainerProfile = await getAuthenticatedTrainerProfile(authUser);

  const client = await prisma.clientProfile.findFirst({
    where: {
      id: clientId,
      trainerId: trainerProfile.id,
    },
  });

  if (!client) {
    const error = new Error("Cliente no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return client;
}

module.exports = {
  createClient,
  getClients,
  getClientById,
};