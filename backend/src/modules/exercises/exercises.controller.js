const { ZodError } = require("zod");
const { createExerciseSchema } = require("./exercises.schemas");
const {
  createExercise,
  getExercises,
  getExerciseById,
} = require("./exercises.service");

async function create(req, res) {
  try {
    const data = createExerciseSchema.parse(req.body);

    const result = await createExercise(req.user, data);

    return res.status(201).json({
      ok: true,
      message: "Ejercicio creado",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Datos inválidos",
        errors: error.issues,
      });
    }

    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.message,
    });
  }
}

async function list(req, res) {
  const data = await getExercises(req.user);

  return res.json({
    ok: true,
    data,
  });
}

async function getOne(req, res) {
  try {
    const data = await getExerciseById(req.user, req.params.id);

    return res.json({
      ok: true,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.message,
    });
  }
}

module.exports = {
  create,
  list,
  getOne,
};