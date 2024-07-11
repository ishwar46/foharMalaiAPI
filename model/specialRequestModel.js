const mongoose = require("mongoose");

const specialRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    category: { type: String, required: true },
    estimatedWaste: { type: String, required: true },
    preferredTime: { type: String, required: true },
    preferredDate: { type: String, required: true },
    additionalInstructions: { type: String },
});

const SpecialRequest = mongoose.model("SpecialRequest", specialRequestSchema);
module.exports = SpecialRequest;