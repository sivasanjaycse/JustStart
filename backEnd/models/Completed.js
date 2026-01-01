const mongoose = require("mongoose");

const completedSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    name: String,
    endingTime: String,
    rewardPoints: Number,
    taskType: String,
    completedAt: {
      type: [Date],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Completed", completedSchema);
