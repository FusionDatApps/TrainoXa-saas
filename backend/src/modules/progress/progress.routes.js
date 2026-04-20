const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth");
const controller = require("./progress.controller");

router.use(requireAuth);

router.post("/", controller.create);
router.get("/assignment/:assignmentId", controller.listByAssignment);

module.exports = router;