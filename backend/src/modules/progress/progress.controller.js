const { ZodError } = require("zod");

const {
  createProgress,
  getProgressByAssignment,
} = require("./progress.service");

const { createProgressSchema } = require("./progress.schemas");

function getValidationMessage(error) {
  if (error instanceof ZodError) {
    return error.issues?.[0]?.message || "Datos inválidos";
  }

  return null;
}

async function create(req, res) {
  try {
    const parsed = createProgressSchema.parse(req.body);

    const data = await createProgress({
      authUser: req.user,
      data: parsed,
    });

    return res.status(201).json({
      ok: true,
      message: "Progreso registrado correctamente",
      data,
    });
  } catch (error) {
    const validationMessage = getValidationMessage(error);

    return res.status(error.statusCode || 400).json({
      ok: false,
      message:
        validationMessage ||
        error.message ||
        "Error al registrar progreso",
    });
  }
}

async function listByAssignment(req, res) {
  try {
    const data = await getProgressByAssignment({
      authUser: req.user,
      assignmentId: req.params.assignmentId,
    });

    return res.json({
      ok: true,
      message: "Progreso obtenido",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message || "Error al obtener progreso",
    });
  }
}

module.exports = {
  create,
  listByAssignment,
};
