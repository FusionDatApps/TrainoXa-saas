const { z } = require("zod");

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña es demasiado larga"),
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(100, "El nombre completo es demasiado largo"),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
});

module.exports = {
  registerSchema,
  loginSchema,
};