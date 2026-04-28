const express = require("express");

const transactionRoutes = express.Router();
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransactionController,
);

module.exports = transactionRoutes;
