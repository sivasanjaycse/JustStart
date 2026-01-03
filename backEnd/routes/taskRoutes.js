const express = require("express");
const {
  createTask,
  getTasks,
  completeTask,
} = require("../controllers/taskController");
const { getWallet } = require("../controllers/walletController");
const { getCompletedByDate } = require("../controllers/completedController");
const router = express.Router();

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.post("/tasks/:id/complete", completeTask);
router.get("/wallet", getWallet);
router.get("/completed", getCompletedByDate);

module.exports = router;
