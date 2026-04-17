const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

async function registerTrainer({ email, password, fullName }) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("Ya existe un usuario con ese email");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "TRAINER",
      trainerProfile: {
        create: {
          fullName,
        },
      },
    },
    include: {
      trainerProfile: true,
    },
  });

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      trainerProfile: {
        id: user.trainerProfile.id,
        fullName: user.trainerProfile.fullName,
      },
    },
  };
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      trainerProfile: true,
      clientProfile: true,
    },
  });

  if (!user) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      trainerProfile: user.trainerProfile
        ? {
            id: user.trainerProfile.id,
            fullName: user.trainerProfile.fullName,
          }
        : null,
      clientProfile: user.clientProfile
        ? {
            id: user.clientProfile.id,
            fullName: user.clientProfile.fullName,
          }
        : null,
    },
  };
}

module.exports = {
  registerTrainer,
  loginUser,
};