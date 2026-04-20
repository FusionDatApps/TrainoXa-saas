const { z } = require("zod");

const createExerciseSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  description: z.string().optional(),
  muscleGroup: z.string().min(2, "Grupo muscular requerido"),
});

module.exports = {
  createExerciseSchema,
};