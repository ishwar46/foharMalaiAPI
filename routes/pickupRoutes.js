const express = require("express");
const {
    createPickup,
    getPickupsByUserOrSession,
} = require("../controllers/pickupController");

const router = express.Router();

router.post("/create-pickup", createPickup);
router.get("/pickups", getPickupsByUserOrSession);

module.exports = router;