const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// TTL Index
tokenBlacklistSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 3 }, // 3 days
  // expireAfterSeconds is an index configuration option, and MongoDB automatically deletes expired documents using a background process.
);

const tokenBlacklistModel = mongoose.model(
  "TokenBlacklist",
  tokenBlacklistSchema,
);

module.exports = tokenBlacklistModel;
