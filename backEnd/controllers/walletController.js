const Wallet = require("../models/Wallet");

exports.getWallet = async (req, res) => {
  let wallet = await Wallet.findOne();
  if (!wallet) wallet = await Wallet.create({});
  res.json(wallet);
};
