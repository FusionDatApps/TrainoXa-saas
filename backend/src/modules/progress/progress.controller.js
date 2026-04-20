const {
  createProgress,
  getProgressByAssignment,
} = require("./progress.service");

const { createProgressSchema } = require("./progress.schemas");

async function create(req, res) {
  try {
    const parsed = createProgressSchema.parse(req.body);

    const data = await createProgress({
      authUser: req.user,
      data: parsed,
    });

    return res.status(201).json({
      ok: true,
      message: "Progreso registrado",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message,
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
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message,
    });
  }
}

module.exports = {
  create,
  listByAssignment,
};
