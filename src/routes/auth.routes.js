const express = require("express");
const authController = require("../controllers/auth.controller");

const authRoutes = express.Router();

authRoutes.post("/register", authController.userRegisterController);
authRoutes.post("/login", authController.userLoginController);

module.exports = authRoutes;
