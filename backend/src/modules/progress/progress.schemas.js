const { z } = require("zod");

const createProgressSchema = z.object({
  assignmentId: z.string(),
  exerciseId: z.string(),
  repsCompleted: z.string().optional(),
  weightUsedKg: z.number().optional(),
  completed: z.boolean().optional(),
  notes: z.string().optional(),
});

module.exports = {
  createProgressSchema,
};