const User = require("../model/userModel");
const Transaction = require("../model/transactionModel");
const moment = require("moment-timezone");

exports.loadBalance = async (req, res) => {
  const { amount } = req.body;

  if (amount <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Amount should be greater than zero." });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    user.balance += amount;
    await user.save();

    const transaction = new Transaction({
      userId: req.user._id,
      type: "credit",
      amount: amount,
      description: "Balance loaded",
      date: moment().tz("Asia/Kathmandu").format(),
    });
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Balance loaded successfully.",
      balance: user.balance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

// Deduct Balance
exports.deductBalance = async (req, res) => {
  const { amount, description, receiverPhoneNumber, purpose } = req.body;

  if (amount <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Amount should be greater than zero." });
  }

  if (!receiverPhoneNumber || !/^\d{10}$/.test(receiverPhoneNumber)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid receiver phone number." });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.balance < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance." });
    }

    user.balance -= amount;
    await user.save();

    const transaction = new Transaction({
      userId: req.user._id,
      type: "debit",
      amount: amount,
      description: description || "Amount deducted",
      receiverPhoneNumber: receiverPhoneNumber,
      purpose: purpose || "N/A",
      date: moment().tz("Asia/Kathmandu").format(),
    });
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Payment Done! Amount Deducted Successfully.",
      balance: user.balance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

// Get Transaction Logs
exports.getTransactionLogs = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
    });

    const adjustedTransactions = transactions.map((transaction) => {
      return {
        ...transaction.toObject(),
        date: moment(transaction.date)
          .tz("Asia/Kathmandu")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    res.status(200).json({ success: true, data: adjustedTransactions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};
