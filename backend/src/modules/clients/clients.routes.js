const express = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const {
  create,
  list,
  getOne,
} = require("./clients.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/", create);
router.get("/", list);
router.get("/:id", getOne);

module.exports = router;