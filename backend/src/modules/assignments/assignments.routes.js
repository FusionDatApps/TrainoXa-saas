const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth");
const controller = require("./assignments.controller");

router.use(requireAuth);

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);

module.exports = router;