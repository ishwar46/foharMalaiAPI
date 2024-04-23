const mongoose = require("mongoose")
const WasteSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required'],
        maxlength: 40
    }, 
    description: {
        type: String,
        trim: true,
        required: [true, 'Description is required']
    },
    price: {
        type: String,
        trim: true,
        required: [true, 'Price is required']
    },
    wasteImageurl: {
        type: String,
        required: true
    }
}, {timestamps: true} )

const Waste = mongoose.model('waste', WasteSchema)
module.exports = Waste