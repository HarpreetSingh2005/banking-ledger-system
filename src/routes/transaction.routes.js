const express = require("express");

const transactionRoutes = express.Router();
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middleware/auth.middleware");
const systemAuthMiddleware = require("../middleware/systemAuth.middleware");

/**
 * Create a transaction
 * @route POST /api/transactions
 */
transactionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransactionController,
);

/**
 * Create a transaction
 * @route POST /api/transactions/system/init-funds
 */
transactionRoutes.post(
  "/system/init-funds",
  systemAuthMiddleware.systemAuthMiddleware,
  transactionController.createFirstTransactionController,
);

module.exports = transactionRoutes;
