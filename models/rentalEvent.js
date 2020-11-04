const mongoose = require("mongoose");

const rentalEventSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Vehicle"
    },
    costumer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Costumer"
    }
})

module.exports = mongoose.model("RentalEvent", rentalEventSchema);