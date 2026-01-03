const Task = require("../models/Task");
const Completed = require("../models/Completed");
const Wallet = require("../models/Wallet");

// ➕ Add Task (unchanged)
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Get All Tasks (unchanged)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ endingTime: 1 });

    // IST "today" range
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);

    const startOfDay = new Date(istNow);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(istNow);
    endOfDay.setHours(23, 59, 59, 999);

    const completedToday = await Completed.find({
      completedAt: { $gte: startOfDay, $lte: endOfDay },
    }).select("taskId");

    const completedSet = new Set(
      completedToday.map((c) => c.taskId.toString())
    );

    const enrichedTasks = tasks.map((task) => ({
      ...task.toObject(),
      completedToday: completedSet.has(task._id.toString()),
    }));

    res.json(enrichedTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Complete Task
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    let completed = await Completed.findOne({ taskId: task._id });

    const now = new Date();

    if (!completed) {
      completed = new Completed({
        taskId: task._id,
        name: task.name,
        endingTime: task.endingTime,
        rewardPoints: task.rewardPoints,
        taskType: task.taskType,
        completedAt: [now],
      });
    } else {
      completed.completedAt.push(now);
    }

    await completed.save();

    if (task.taskType !== "Routine") {
      await Task.findByIdAndDelete(id);
    }

    let wallet = await Wallet.findOne();
    if (!wallet) {
      wallet = new Wallet();
    }

    wallet.temporaryPoints += task.rewardPoints;
    await wallet.save();

    res.json({ message: "Task completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
