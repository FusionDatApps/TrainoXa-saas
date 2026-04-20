const { z } = require("zod");

const createAssignmentSchema = z.object({
  clientId: z.string(),
  workoutPlanId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

module.exports = {
  createAssignmentSchema,
};