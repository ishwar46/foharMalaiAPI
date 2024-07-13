const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: false,
  },
  receiverPhoneNumber: {
    type: String,
    required: false,
  },
  purpose: {
    type: String,
    required: false,
  },
});

const Transaction = mongoose.model("transactions", transactionSchema);
module.exports = Transaction;
