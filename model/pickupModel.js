const mongoose = require("mongoose");

const PickupSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
});

const Pickup = mongoose.model("Pickup", PickupSchema);

module.exports = Pickup;