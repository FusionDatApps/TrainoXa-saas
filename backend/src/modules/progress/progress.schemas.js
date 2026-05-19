const { z } = require("zod");

const createProgressSchema = z.object({
  assignmentId: z.string().min(1),

  exerciseId: z.string().min(1),

  performedAt: z.string().datetime().optional(),

  repsCompleted: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(
      /^[0-9+\- xXdropsetDROPSETrepREP]+$/,
      "Formato de repeticiones inválido"
    )
    .optional(),

  weightUsedKg: z
    .number()
    .positive("El peso debe ser mayor a 0")
    .optional(),

  completed: z.boolean().optional(),

  notes: z.string().max(500).optional(),
});

module.exports = {
  createProgressSchema,
};