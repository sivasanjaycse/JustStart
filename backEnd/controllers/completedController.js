const Completed = require("../models/Completed");

exports.getCompletedByDate = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    // Build IST day range
    const start = new Date(`${date}T00:00:00.000+05:30`);
    const end = new Date(`${date}T23:59:59.999+05:30`);

    const completed = await Completed.find({
      completedAt: { $gte: start, $lte: end },
    }).sort({ completedAt: 1 }); // earliest → latest

    const totalPoints = completed.reduce((sum, t) => sum + t.rewardPoints, 0);

    res.json({
      date,
      totalPoints,
      count: completed.length,
      tasks: completed.map((t) => ({
        _id: t._id,
        name: t.name,
        rewardPoints: t.rewardPoints,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
