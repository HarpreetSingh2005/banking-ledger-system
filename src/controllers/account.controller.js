const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
  const user = req.user;

  try {
    const account = await accountModel.create({ user: user._id });
    return res.status(201).json({ account });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getAllAccountsController(req, res) {
  const user = req.user;
  try {
    const accounts = await accountModel.find({ user: user._id });
    return res.status(200).json({ accounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getBalanceController(req, res) {
  const { accountId } = req.params;
  const user = req.user;

  const account = await accountModel.findOne({
    _id: accountId,
    user: user._id,
  });
  if (!account) return res.status(404).json({ message: "Account not found" });
  const balance = await account.getBalance();
  try {
    return res.status(200).json({ account: account, balance: balance });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
module.exports = {
  createAccountController,
  getAllAccountsController,
  getBalanceController,
};
