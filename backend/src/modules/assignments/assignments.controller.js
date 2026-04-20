const {
  createAssignment,
  getAssignments,
  getAssignmentById,
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
      message: error.message,
    });
  }
}

async function list(req, res) {
  const data = await getAssignments(req.user);

  return res.json({
    ok: true,
    data,
  });
}

async function getById(req, res) {
  try {
    const data = await getAssignmentById({
      authUser: req.user,
      assignmentId: req.params.id,
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
  list,
  getById,
};