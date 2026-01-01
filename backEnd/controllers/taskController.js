const Task = require("../models/Task");

// ➕ Add Task
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ endingTime: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
