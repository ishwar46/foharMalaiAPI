const express = require("express");
const {
  createSpecialRequest,
  getSpecialRequests,
} = require("../controllers/specialRequestController");
const { authGuard } = require("../middleware/authGuard");
const router = express.Router();

router.post("/create-special-req", authGuard, createSpecialRequest);

router.get("/get-special-req", authGuard, getSpecialRequests);

module.exports = router;
