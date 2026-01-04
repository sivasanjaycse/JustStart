const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  completeTask,
} = require("../controllers/taskController");
const { getWallet } = require("../controllers/walletController");
const { getCompletedByDate } = require("../controllers/completedController");
const {
  getRewards,
  addReward,
  purchaseReward,
} = require("../controllers/rewardController");

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.post("/tasks/:id/complete", completeTask);

router.get("/wallet", getWallet);

router.get("/completed", getCompletedByDate);

router.get("/rewards", getRewards);
router.post("/rewards", addReward);
router.post("/rewards/:id/purchase", purchaseReward);

module.exports = router;
