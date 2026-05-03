const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailServices = require("../services/email.services");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * - Register new user
 * - /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isExist = await UserModel.findOne({ email: email });
  if (isExist) {
    return res.status(422).json({
      message: "User already exists",
      status: "failed",
    });
  }
  try {
    const user = await UserModel.create({
      email: email,
      name: name,
      password: password,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);
    res.status(201).json({
      message: "User created successfully",
      status: "success",
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });

    await emailServices.sendRegisterationEmail(user.email, user.name);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * - Login user
 * - /api/auth/login
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userExist = await UserModel.findOne({ email: email }).select(
      "+password",
    );
    if (!userExist) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await userExist.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.cookie("token", token);

    return res.status(200).json({
      message: "User logged in successfully",
      status: "success",
      data: userExist,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * - Logout user
 * - /api/auth/logout
 */
async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    res.clearCookie("token");
    await tokenBlacklistModel.create({ token: token });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
};
