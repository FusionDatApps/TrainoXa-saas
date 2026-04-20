const { z } = require("zod");

const createClientSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nombre demasiado corto"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido"),

  password: z
    .string()
    .min(6, "Password mínimo 6 caracteres"),

  age: z.number().int().positive().optional(),
  weightKg: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  goal: z.string().optional(),
  notes: z.string().optional(),
});

module.exports = {
  createClientSchema,
};