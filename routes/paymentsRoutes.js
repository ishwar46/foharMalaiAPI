const express = require("express");
const router = express.Router();
const { authGuard } = require("../middleware/authGuard");
const paymentController = require("../controllers/paymentController");

router.post("/load-balance", authGuard, paymentController.loadBalance);
router.post("/deduct-balance", authGuard, paymentController.deductBalance);
router.get(
  "/transaction-logs",
  authGuard,
  paymentController.getTransactionLogs
);

module.exports = router;
