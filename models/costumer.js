const mongoose = require("mongoose");

const costumerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isVIP: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model("Costumer", costumerSchema);