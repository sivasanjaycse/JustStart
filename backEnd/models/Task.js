const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
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
      default: "PLACEHOLDER"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
