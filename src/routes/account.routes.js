const express = require("express");

const accountRoutes = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

/**
 * Create an account
 * @route POST /api/accounts
 */
accountRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);

/**
 * Get all accounts
 * @route GET /api/accounts/get-all
 */
accountRoutes.get(
  "/get-all",
  authMiddleware.authMiddleware,
  accountController.getAllAccountsController,
);

/**
 * Get account balance
 * @route GET /api/accounts/balance/:accountId
 */
accountRoutes.get(
  "/balance/:accountId",
  authMiddleware.authMiddleware,
  accountController.getBalanceController,
);

module.exports = accountRoutes;
