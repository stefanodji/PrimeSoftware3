const express = require("express");
const router = express.Router();
const RentalEvent = require("../models/rentalEvent.js");
const Vehicle = require("../models/vehicle.js");
const Costumer = require("../models/costumer.js");
const rentalEvent = require("../models/rentalEvent.js");

//All Rents Route
router.get("/", async (req,res) => {
    
    try{
        const allRents = await RentalEvent.find({});
        for(var x=0; x<allRents.length; x++){
            allRents[x] = await RentalEvent.findOne(allRents[x]).populate("costumer vehicle").exec();
        }
        
        res.render("rentalEvents/index.ejs", {allRents: allRents});
    }
    catch (err){
        console.log(err);
        res.redirect("/");
    }
    

})

//New Rent Route
router.get("/new", (req,res) => {
    res.send("Nova rent")
})

//Create Rent Route
router.post("/", async (req, res) => {
    const rentalEvent = new RentalEvent({
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        vehicle: req.body.idVehicle,
        costumer: req.body.chooseCostumer
    })

    if(rentalEvent.endDate > rentalEvent.startDate){
        var diff = (Math.abs(rentalEvent.endDate - rentalEvent.startDate))/1000/60/60/24;
        
        if(diff>3){
            rentalEvent.discount = 5;
        } else if(diff>5){
            rentalEvent.discount = 7;
        } else if(diff>10){
            rentalEvent.discount = 10;
        }

        try {
            const vehicle = await Vehicle.findById(rentalEvent.vehicle);
            rentalEvent.price = diff*vehicle.pricePerDay - diff*vehicle.pricePerDay*rentalEvent.discount/100;
            const newRentalEvent = await rentalEvent.save();

            vehicle.count--;
            await vehicle.save();
            res.redirect("/rentalEvents");
        } catch (err){
            console.log(err);
            res.redirect(`/rentalEvents/vehicle/${req.body.idVehicle}`);
        }
    }
    else{
        res.redirect(`/rentalEvents/vehicle/${req.body.idVehicle}`);
    }
    
})

router.get("/vehicle/:id", async (req, res) => {
    try{
        const vehicle = await Vehicle.findById(req.params.id);
        const costumers = await Costumer.find({});

        res.render("rentalEvents/new.ejs",
                { vehicle: vehicle,
                    costumers: costumers
                }
    );
    }catch{
        res.redirect(`/vehicles/${req.params.id}`);
    }
    
})

router.delete("/:id", async (req, res) => {
    let rentalEvent;
    try{
        rentalEvent = await RentalEvent.findById(req.params.id);
        await rentalEvent.remove();
        res.redirect("/rentalEvents/");
    } catch{
        if(rentalEvent == null){
            res.redirect("/");
        }
        else{
            res.redirect(`/rentalEvents/${req.params.id}`);
        }
        
    }
})

module.exports = router;