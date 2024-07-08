const Pickup = require("../model/pickupModel");

// Create a new pickup request
exports.createPickup = async(req, res) => {
    const {
        fullName,
        phoneNumber,
        address,
        date,
        time,
        coordinates,
        userId,
        sessionId,
    } = req.body;

    try {
        const newPickup = new Pickup({
            fullName,
            phoneNumber,
            address,
            date,
            time,
            coordinates,
            userId: userId || null,
            sessionId: sessionId || null,
        });

        await newPickup.save();
        res.status(201).json({
            message: "Pickup request created successfully",
            data: newPickup,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create pickup request",
            error: error.message,
        });
    }
};

// Get all pickup requests
exports.getPickupsByUserOrSession = async(req, res) => {
    const { userId, sessionId } = req.query;

    try {
        let query = {};
        if (userId) {
            query.userId = userId;
        } else if (sessionId) {
            query.sessionId = sessionId;
        } else {
            return res
                .status(400)
                .json({ message: "userId or sessionId is required" });
        }

        const pickups = await Pickup.find(query);
        res.status(200).json({
            message: "Pickup requests retrieved successfully",
            data: pickups,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve pickup requests",
            error: error.message,
        });
    }
};