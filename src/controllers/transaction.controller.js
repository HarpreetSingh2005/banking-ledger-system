const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

const emailServices = require("../services/email.services");

/**
 * 10 step flow for a transaction
 * - 1. Validate requrest
 * - 2. Validate the idempotency key
 * - 3. Check account status
 * - 4. Derive sender balance from ledger
 * - 5. Create a transaction (Pending)
 * - 6. Create a ledger entry for the Debit
 * - 7. Create a ledger entry for the Credit
 * - 8. Mark the transaction as completed
 * - 9. Commit the mongoDB session
 * - 10. Send email notification
 */

async function createTransactionController(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  const user = req.user;
  /**
   * 1. Validate request
   */
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "FromAccount, ToAccount, Amount and IdempotencyKey are required",
    });
  }

  const fromAccountExist = await accountModel.findOne({
    _id: fromAccount,
    user: user._id,
  });
  const toAccountExist = await accountModel.findOne({ _id: toAccount });
  const reciever = await userModel.findOne({ _id: toAccountExist.user });

  if (!fromAccountExist || !toAccountExist) {
    return res.status(400).json({ message: "Account not found" });
  }
  /**
   * 2. Validate the idempotency key
   */

  const isTransactionExist = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionExist) {
    if (isTransactionExist.status == "COMPLETED") {
      return res.status(200).json({ message: "Transaction already completed" });
    }
    if (isTransactionExist.status == "PENDING") {
      return res
        .status(200)
        .json({ message: "Transaction exists and is pending" });
    }
    if (isTransactionExist.status == "FAILED") {
      return res.status(500).json({ message: "Transaction failed" });
    }
    if (isTransactionExist.status == "REVERSED") {
      return res.status(500).json({ message: "Transaction was reversed" });
    }
  }
  /**
   * 3. Check account status
   */

  if (
    fromAccountExist.status != "ACTIVE" ||
    toAccountExist.status != "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both From Account and To Account must be Active for transaction",
    });
  }

  /**
   * 4. Derive sender balance from ledger
   */
  const balance = await fromAccountExist.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Transaction amount is ${amount}`,
    });
  }

  let transaction;
  try {
    /**
     * 5. Create a transaction (Pending)
     */
    const session = await mongoose.startSession();
    await session.startTransaction();

    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    /**
     * 6. Create a ledger entry for the Debit
     */
    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          transaction: transaction._id,
          amount: amount,
          type: "DEBIT",
        },
      ],
      { session },
    );

    //Simulating real life lag
    // /* TODO: Need to check whether after the debut, can we reattempt for the transaction again
    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 100 * 1000));
    })();
    //  */

    /**
     * 7. Create a ledger entry for the Credit
     */
    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          transaction: transaction._id,
          amount: amount,
          type: "CREDIT",
        },
      ],
      { session },
    );

    /**
     * 8. Mark the transaction as completed
     */
    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    // await transactionModel.findOneAndUpdate(
    //   { _id: transaction._id },
    //   { status: "FAILED" },
    // );
    return res.status(400).json({
      message:
        "Transaction is Pending due to some reasons. Wait for some time and try again",
    });
  }

  /**
   * 10. Send email notification
   */

  await emailServices.sendTransactionEmail(
    user.email,
    user.name,
    reciever.name,
    amount,
  );

  return res
    .status(201)
    .json({ message: "Transaction successful", transaction: transaction });
}

async function createFirstTransactionController(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "ToAccount, Amount and IdempotencyKey are required",
    });
  }

  const toAccountExist = await accountModel.findById(toAccount);

  if (!toAccountExist) {
    return res.status(400).json({ message: "Invalid Account" });
  }

  const fromAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromAccount) {
    return res.status(400).json({ message: "Systemuser Account not found" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromAccount._id,
        transaction: transaction._id,
        amount: amount,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        transaction: transaction._id,
        amount: amount,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";

  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction: transaction,
  });
}

module.exports = {
  createTransactionController,
  createFirstTransactionController,
};
