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

router.get("/:id", async (req, res) => { 
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        res.render("vehicles/show.ejs", {vehicle: vehicle});
    } catch {
        res.redirect("/vehicles");
    }
})

router.get("/:id/edit", async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        res.render("vehicles/edit.ejs", { vehicle: vehicle});
    } catch {
        res.redirect("/vehicles");
    }
})

router.put("/:id", async (req, res) => {
    let vehicle;
    try{
        vehicle = await Vehicle.findById(req.params.id);
        vehicle.vehicleType = req.body.vehicleType;
        vehicle.brand = req.body.brand;
        vehicle.model = req.body.model;
        vehicle.constructionYear = req.body.constructionYear;
        vehicle.fuelType = req.body.fuelType;
        vehicle.numberOfSeats = req.body.numberOfSeats;
        vehicle.pricePerDay = req.body.pricePerDay;
        vehicle.count = req.body.count;

        if(req.body.image != null && req.body.image != ""){
            saveImage(vehicle, req.body.image);
        }

        await vehicle.save();
        res.redirect(`/vehicles/${vehicle.id}`);
    } catch{
        if(vehicle == null){
            res.redirect("/vehicles");
        }
        else{
            res.render("vehicles/edit", {
                vehicle: vehicle,
                errorMessage: "Doslo je do greske u cuvanju podataka :/"
            })
        }
        
    }
})

router.delete("/:id", async (req, res) => { //Nikad GET za DELETE heheh
    let vehicle;
    try{
        vehicle = await Vehicle.findById(req.params.id);
        await vehicle.remove();
        res.redirect("/vehicles/");
    } catch{
        if(vehicle == null){
            res.redirect("/");
        }
        else{
            res.redirect(`/vehicles/${req.params.id}`);
        }
        
    }
})

function saveImage(vehicle, imageEncoded){
    if(imageEncoded == null) return
    const image = JSON.parse(imageEncoded);
    if(image != null && imageMimeTypes.includes(image.type)){
        vehicle.image = new Buffer.from(image.data, "base64");
        vehicle.imageType = image.type;
    }
}


module.exports = router;