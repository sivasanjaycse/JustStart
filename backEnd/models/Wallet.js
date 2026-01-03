const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    permanentPoints: {
      type: Number,
      default: 0,
    },
    temporaryPoints: {
      type: Number,
      default: 0,
    },
    lastProcessedDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
