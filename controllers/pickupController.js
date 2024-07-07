const Pickup = require("../model/pickupModel");

// Create a new pickup request
exports.createPickup = async(req, res) => {
    const { fullName, phoneNumber, address, date, time, coordinates } = req.body;
    try {
        const newPickup = new Pickup({
            fullName,
            phoneNumber,
            address,
            date,
            time,
            coordinates,
        });
        await newPickup.save();
        res.status(201).json({
            message: "Pickup request created successfully",
            data: newPickup,
        });
    } catch (error) {
        console.error("Failed to create pickup request:", error);
        res.status(500).json({
            message: "Failed to create pickup request",
            error: error.message,
        });
    }
};

// Get all pickup requests
exports.getAllPickups = async(req, res) => {
    try {
        const pickups = await Pickup.find();
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