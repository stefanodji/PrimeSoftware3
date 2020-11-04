const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({

    vehicleType: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    constructionYear: {
        type: Number,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    numberOfSeats: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    image: {
        type: Buffer,
        required: true
    },
    imageType: {
        type: String,
        required: true
    }
})


vehicleSchema.virtual("imagePath").get(function() {
    if (this.image != null && this.imageType != null){ //nije arow fja, da bismo mogli da koristimo this, koji povezuje book
        return `data:${this.imageType};charset=utf-8;base64,
       ${this.image.toString("base64")}`;  
    }
})

module.exports = mongoose.model("Vehicle", vehicleSchema);