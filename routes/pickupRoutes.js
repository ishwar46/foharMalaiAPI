const express = require("express");
const {
    createPickup,
    getAllPickups,
} = require("../controllers/pickupController");

const router = express.Router();

router.post("/create-pickup", createPickup);
router.get("/pickups", getAllPickups);

module.exports = router;