const { z } = require("zod");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const createAssignmentSchema = z.object({
  clientId: z.string().min(1, "El cliente es obligatorio"),
  workoutPlanId: z.string().min(1, "La rutina es obligatoria"),
  startDate: z
    .string()
    .regex(dateRegex, "La fecha inicial debe tener formato YYYY-MM-DD")
    .optional(),
  endDate: z
    .string()
    .regex(dateRegex, "La fecha final debe tener formato YYYY-MM-DD")
    .optional(),
});

module.exports = {
  createAssignmentSchema,
};
