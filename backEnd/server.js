const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 PUT YOUR MONGOOSE URL HERE
mongoose
  .connect("mongodb+srv://sivasanjaidisco_db_user:9EUymTk5tuHKRJLP@cluster0.phzlk1k.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 🧩 Task Schema
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  endingTime: {
    type: String,
    required: true
  },
  rewardPoints: {
    type: Number,
    required: true
  },
  taskType: {
    type: String,
    default: "PLACEHOLDER" // future use
  }
});

const Task = mongoose.model("Task", taskSchema);

// ➕ Add Task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ endingTime: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
