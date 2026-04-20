const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./modules/auth/auth.routes");

const app = express();
const clientsRoutes = require("./modules/clients/clients.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "TrainoXa API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);

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