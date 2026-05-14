const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deactivateAssignment,
} = require("./assignments.service");

const { createAssignmentSchema } = require("./assignments.schemas");

async function create(req, res) {
  try {
    const parsed = createAssignmentSchema.parse(req.body);

    const assignment = await createAssignment({
      authUser: req.user,
      data: parsed,
    });

    return res.status(201).json({
      ok: true,
      message: "Asignación creada",
      data: assignment,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message || "Error al crear asignación",
    });
  }
}

async function list(req, res) {
  try {
    const data = await getAssignments(req.user);

    return res.json({
      ok: true,
      message: "Asignaciones obtenidas",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message,
    });
  }
}

async function getById(req, res) {
  try {
    const data = await getAssignmentById({
      authUser: req.user,
      assignmentId: req.params.id,
    });

    return res.json({
      ok: true,
      message: "Asignación obtenida",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message,
    });
  }
}

async function deactivate(req, res) {
  try {
    const data = await deactivateAssignment({
      authUser: req.user,
      assignmentId: req.params.id,
    });

    return res.json({
      ok: true,
      message: "Asignación desactivada",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message || "Error al desactivar asignación",
    });
  }
}

module.exports = {
  create,
  list,
  getById,
  deactivate,
};