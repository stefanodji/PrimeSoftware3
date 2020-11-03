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
    }
})

module.exports = mongoose.model("Costumer", costumerSchema);