const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

//One user can have multiple accounts
const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Account must be associated with a user"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status must be ACTIVE, FROZEN or CLOSED",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      required: [true, "Currency is required for creating an account"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
  const balance = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null, //it is null because we don't want to group by any field
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0, //this means that the _id field will not be included in the result
        balance: { $subtract: ["$totalDebit", "$totalCredit"] },
      },
    },
  ]);
  if (balance.length > 0) return balance[0].balance;
  return 0; //for newly created account since the ledger is empty at this point so the balance length will be 0
};

const accountModel = mongoose.model("Account", accountSchema);
module.exports = accountModel;
