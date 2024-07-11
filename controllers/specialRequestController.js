const SpecialRequest = require("../model/specialRequestModel");

exports.createSpecialRequest = async(req, res) => {
    try {
        const {
            category,
            estimatedWaste,
            preferredTime,
            preferredDate,
            additionalInstructions,
        } = req.body;

        if (!category || !estimatedWaste || !preferredTime || !preferredDate) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        const specialRequest = new SpecialRequest({
            user: req.user._id,
            category,
            estimatedWaste,
            preferredTime,
            preferredDate,
            additionalInstructions,
        });

        const savedRequest = await specialRequest.save();
        res.status(201).json({
            success: true,
            message: "Special request created successfully",
            data: savedRequest,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating special request",
            error: error.message,
        });
    }
};

exports.getSpecialRequests = async(req, res) => {
    try {
        const specialRequests = await SpecialRequest.find({ user: req.user._id });

        if (!specialRequests.length) {
            return res.status(404).json({
                success: false,
                message: "No special requests found for the user",
            });
        }

        res.status(200).json({
            success: true,
            message: "Special requests retrieved successfully",
            data: specialRequests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching special requests",
            error: error.message,
        });
    }
};