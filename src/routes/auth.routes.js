const express = require("express");
const authController = require("../controllers/auth.controller");

const authRoutes = express.Router();

router.post("/register", authController.userRegisterController);
router.post("/login", authController.userLoginController);

module.exports = authRoutes;
