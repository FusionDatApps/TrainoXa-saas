const { z } = require("zod");

const createWorkoutSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

const addExerciseSchema = z.object({
  exerciseId: z.string(),
  exerciseOrder: z.number().int().positive(),
  sets: z.number().int().positive(),
  reps: z.string(),
  restSeconds: z.number().int().optional(),
  notes: z.string().optional(),
});

module.exports = {
  createWorkoutSchema,
  addExerciseSchema,
};