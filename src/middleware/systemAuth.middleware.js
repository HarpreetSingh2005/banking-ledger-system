const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const systemAuthMiddleware = async function (req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token is invalid" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ _id: decoded.userId }).select(
      "+systemUser",
    );

    if (!user.systemUser) {
      return res
        .status(403)
        .json({ message: "Forbidden access, not a system user" });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized, token is invalid" });
  }
};

module.exports = { systemAuthMiddleware };
