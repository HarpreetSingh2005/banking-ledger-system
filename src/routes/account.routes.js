const express = require("express");

const accountRoutes = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

accountRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);

module.exports = accountRoutes;
