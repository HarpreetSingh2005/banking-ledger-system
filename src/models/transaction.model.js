const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "From account is required for creating a transaction"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "To account is required for creating a transaction"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for creating a transaction"],
      min: [0, "Amount must be greater than 0"],
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message: "Status must be PENDING, COMPLETED, REVERSED or FAILED",
      },
      default: "PENDING",
    },
    idempotencyKey: {
      type: String,
      required: [
        true,
        "Idempotency key is required for creating a transaction",
      ],
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const transactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = transactionModel;
