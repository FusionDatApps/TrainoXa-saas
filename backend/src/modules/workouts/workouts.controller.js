const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  addExerciseToWorkout,
  getWorkoutExercises,
} = require("./workouts.service");

const {
  createWorkoutSchema,
  addExerciseSchema,
} = require("./workouts.schemas");

async function create(req, res) {
  try {
    const parsed = createWorkoutSchema.parse(req.body);

    const workout = await createWorkout({
      authUser: req.user,
      ...parsed,
    });

    return res.status(201).json({
      ok: true,
      message: "Rutina creada",
      data: workout,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message || "Error al crear rutina",
    });
  }
}

async function list(req, res) {
  try {
    const workouts = await getWorkouts(req.user);

    return res.json({
      ok: true,
      data: workouts,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message || "Error al listar rutinas",
    });
  }
}

async function getById(req, res) {
  try {
    const workout = await getWorkoutById({
      authUser: req.user,
      workoutId: req.params.id,
    });

    if (!workout) {
      return res.status(404).json({
        ok: false,
        message: "Rutina no encontrada",
      });
    }

    return res.json({
      ok: true,
      data: workout,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message || "Error al obtener rutina",
    });
  }
}

async function addExercise(req, res) {
  try {
    const parsed = addExerciseSchema.parse(req.body);

    const item = await addExerciseToWorkout({
      authUser: req.user,
      workoutId: req.params.id,
      data: parsed,
    });

    return res.status(201).json({
      ok: true,
      message: "Ejercicio agregado",
      data: item,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message || "Error al agregar ejercicio",
    });
  }
}

async function listExercises(req, res) {
  try {
    const items = await getWorkoutExercises({
      authUser: req.user,
      workoutId: req.params.id,
    });

    return res.json({
      ok: true,
      data: items,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.message || "Error al listar ejercicios de la rutina",
    });
  }
}

module.exports = {
  create,
  list,
  getById,
  addExercise,
  listExercises,
};