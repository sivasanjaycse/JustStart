const express = require("express");
const {
  createTask,
  getTasks
} = require("../controllers/taskController");

const router = express.Router();

router.post("/tasks", createTask);
router.get("/tasks", getTasks);

module.exports = router;
