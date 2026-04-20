const { ZodError } = require("zod");
const { createClientSchema } = require("./clients.schemas");
const {
  createClient,
  getClients,
  getClientById,
} = require("./clients.service");

async function create(req, res) {
  try {
    const data = createClientSchema.parse(req.body);

    const result = await createClient(req.user, data);

    return res.status(201).json({
      ok: true,
      message: "Cliente creado",
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
      message: error.message || "Error interno del servidor",
    });
  }
}

async function list(req, res) {
  try {
    const data = await getClients(req.user);

    return res.json({
      ok: true,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.message || "Error interno del servidor",
    });
  }
}

async function getOne(req, res) {
  try {
    const data = await getClientById(req.user, req.params.id);

    return res.json({
      ok: true,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.message || "Error interno del servidor",
    });
  }
}

module.exports = {
  create,
  list,
  getOne,
};