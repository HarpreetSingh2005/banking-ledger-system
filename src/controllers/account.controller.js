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

module.exports = { createAccountController };
