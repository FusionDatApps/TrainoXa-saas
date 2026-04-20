const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth");

const controller = require("./workouts.controller");

router.use(requireAuth);

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);

router.post("/:id/exercises", controller.addExercise);
router.get("/:id/exercises", controller.listExercises);

module.exports = router;