const {
  getSummary,
  getRecentActivity,
} = require("./dashboard.service");

async function summary(req, res) {
  try {
    const data = await getSummary(req.user);

    return res.json({
      ok: true,
      message: "Resumen obtenido",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

async function recentActivity(req, res) {
  try {
    const data = await getRecentActivity(req.user);

    return res.json({
      ok: true,
      message: "Actividad reciente obtenida",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

module.exports = {
  summary,
  recentActivity,
};