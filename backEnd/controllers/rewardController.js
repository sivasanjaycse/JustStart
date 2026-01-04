const Reward = require("../models/Reward");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const mongoose = require("mongoose");
exports.getRewards = async (req, res) => {
  const rewards = await Reward.find().sort({ rewardPoints: 1 });
  res.json(rewards);
};

exports.addReward = async (req, res) => {
  const reward = new Reward(req.body);
  await reward.save();
  res.status(201).json(reward);
};

exports.purchaseReward = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const reward = await Reward.findById(req.params.id).session(session);
    if (!reward) throw new Error("Reward not found");

    const wallet = await Wallet.findOne().session(session);
    if (!wallet) throw new Error("Wallet not found");

    if (wallet.permanentPoints < reward.rewardPoints) {
      throw new Error("INSUFFICIENT_POINTS");
    }

    wallet.permanentPoints -= reward.rewardPoints;
    await wallet.save();
    await Transaction.create(
      [
        {
          rewardId: reward._id,
          rewardName: reward.rewardName,
          rewardPoints: reward.rewardPoints,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.json({ success: true });
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ error: e.message });
  } finally {
    session.endSession();
  }
};
