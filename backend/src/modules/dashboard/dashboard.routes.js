const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth");
const controller = require("./dashboard.controller");

router.use(requireAuth);

router.get("/summary", controller.summary);
router.get("/recent-activity", controller.recentActivity);

module.exports = router;