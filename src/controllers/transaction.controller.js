const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");

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

function createTransactionController(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
}

module.exports = { createTransactionController };
