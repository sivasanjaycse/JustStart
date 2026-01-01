const express = require("express");
const {
  createTask,
  getTasks,
  completeTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.post("/tasks/:id/complete", completeTask);

module.exports = router;
