
const { ZodError } = require("zod");
const { registerSchema, loginSchema } = require("./auth.schemas");
const { registerTrainer, loginUser } = require("./auth.service");

async function register(req, res) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerTrainer(data);

    return res.status(201).json({
      ok: true,
      message: "Entrenador registrado correctamente",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Datos inválidos",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      ok: false,
      message: error.message || "Error interno del servidor",
    });
  }
}

async function login(req, res) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);

    return res.status(200).json({
      ok: true,
      message: "Login correcto",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Datos inválidos",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      ok: false,
      message: error.message || "Error interno del servidor",
    });
  }
}

module.exports = {
  register,
  login,
};