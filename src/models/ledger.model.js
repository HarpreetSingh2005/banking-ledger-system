const mongoose = require("mongoose");

//since ledger is only source of truth, it must implement immutability
const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Account is required for creating a ledger"],
    index: true,
    immutable: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: [true, "Transaction is required for creating a ledger"],
    index: true,
    immutable: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required for creating a ledger"],
    min: [0, "Amount must be greater than 0"],
    immutable: true,
  },

  type: {
    type: String,
    enum: {
      values: ["DEBIT", "CREDIT"],
      message: "Type must be DEBIT or CREDIT",
    },
    required: [true, "Type is required for creating a ledger"],
    immutable: true,
  },
});

function preventLedgerUpdate() {
  throw new Error("Ledger are immutable and cannot be updated");
}

//prevents ledger from being updated by any chance
ledgerSchema.pre("updateOne", preventLedgerUpdate);
ledgerSchema.pre("updateMany", preventLedgerUpdate);
ledgerSchema.pre("findOneAndUpdate", preventLedgerUpdate);
ledgerSchema.pre("findOneAndReplace", preventLedgerUpdate);
ledgerSchema.pre("findOneAndDelete", preventLedgerUpdate);
ledgerSchema.pre("deleteOne", preventLedgerUpdate);
ledgerSchema.pre("deleteMany", preventLedgerUpdate);
ledgerSchema.pre("remove", preventLedgerUpdate);

const ledgerModel = mongoose.model("Ledger", ledgerSchema);
module.exports = ledgerModel;
