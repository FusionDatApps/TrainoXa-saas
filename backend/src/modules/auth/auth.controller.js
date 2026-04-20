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
      });
    }

    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.message || "Error interno del servidor",
    });
  }
}

async function login(req, res) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);

    return res.json({
      ok: true,
      message: "Login exitoso",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Datos inválidos",
      });
    }

    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.message || "Error interno del servidor",
    });
  }
}

module.exports = {
  register,
  login,
};