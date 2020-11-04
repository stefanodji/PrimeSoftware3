const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const Vehicle = require("../models/vehicle.js");

const imageMimeTypes = ["image/jpeg","image/png", "image/gif"];


//All Vehicles Route
router.get("/", async (req, res) =>{
    let searchOptions = {};

    if(req.query.brand != null && req.query.brand != ""){
        searchOptions.brand = new RegExp(req.query.brand, "i") //i -> case insensitive
    }
    if(req.query.model != null && req.query.model != ""){
        searchOptions.model = new RegExp(req.query.model, "i") //i -> case insensitive
    }
    if(req.query.fuelType != null && req.query.fuelType != ""){
        searchOptions.fuelType = new RegExp(req.query.fuelType, "i") //i -> case insensitive
    }
    if(req.query.pricePerDay != null && req.query.pricePerDay != ""){
        searchOptions.pricePerDay = { $lte : parseInt(req.query.pricePerDay)};
    }
    
    try {
        const vehicles = await Vehicle.find(searchOptions);
        res.render("vehicles/index.ejs", {
            vehicles: vehicles,
            searchOptions: req.query
        })
    } catch {
        res.redirect("/");
    }
})

//New Vehicle Route
router.get("/new", (req, res) =>{
    res.render("vehicles/new.ejs", {vehicle: new Vehicle()});
})

//Create Vehicle Route
router.post("/", async (req, res) =>{
    const vehicle = new Vehicle({
        vehicleType: req.body.vehicleType,
        brand: req.body.brand,
        model: req.body.model,
        constructionYear: req.body.constructionYear,
        fuelType: req.body.fuelType,
        numberOfSeats: req.body.numberOfSeats,
        pricePerDay: req.body.pricePerDay,
        count: req.body.count
    });
    saveImage(vehicle, req.body.image);

    try{
        const newVehicle = await vehicle.save();
        res.redirect("vehicles");
    }
    catch{
        res.render("vehicles/new", {
            vehicle: vehicle,
            errorMessage: "Niste pravilno popunili polja"
        })
    }
});


function saveImage(vehicle, imageEncoded){
    if(imageEncoded == null) return
    const image = JSON.parse(imageEncoded);
    if(image != null && imageMimeTypes.includes(image.type)){
        vehicle.image = new Buffer.from(image.data, "base64");
        vehicle.imageType = image.type;
    }
}


module.exports = router;