const express = require("express");
const {
  createTask,
  getTasks,
  completeTask,
} = require("../controllers/taskController");
const { getWallet } = require("../controllers/walletController");
const router = express.Router();

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.post("/tasks/:id/complete", completeTask);
router.get("/wallet", getWallet);

module.exports = router;
