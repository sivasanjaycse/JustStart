// models/Reward.js
const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    rewardName: { type: String, required: true },
    rewardPoints: { type: Number, required: true },
    rewardPic: { type: String, required: true }, // base64 (efficient enough for small images)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);
