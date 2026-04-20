const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./modules/auth/auth.routes");
const exercisesRoutes = require("./modules/exercises/exercises.routes");
const workoutsRoutes = require("./modules/workouts/workouts.routes");

const app = express();
const clientsRoutes = require("./modules/clients/clients.routes");
const assignmentsRoutes = require("./modules/assignments/assignments.routes");
const progressRoutes = require("./modules/progress/progress.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "TrainoXa API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`TrainoXa server running on port ${PORT}`);
});