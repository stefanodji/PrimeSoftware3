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
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("RentalEvent", rentalEventSchema);