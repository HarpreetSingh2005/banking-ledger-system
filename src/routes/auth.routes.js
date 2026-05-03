const express = require("express");
const authController = require("../controllers/auth.controller");

const authRoutes = express.Router();

/**
 * - Register new user
 * - /api/auth/register
 */
authRoutes.post("/register", authController.userRegisterController);

/**
 * - Login user
 * - /api/auth/login
 */
authRoutes.post("/login", authController.userLoginController);

/**
 * - Logout user
 * - /api/auth/logout
 */
authRoutes.post("/logout", authController.userLogoutController);

module.exports = authRoutes;
