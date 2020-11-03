const express = require("express");
const Costumer = require("../models/costumer.js");
const router = express.Router();

const Author = require("../models/costumer.js");


//All Costumers Route
router.get("/", async (req,res) => {
    let searchOptions = {};
    if(req.query.fullName != null && req.query.fullName != ""){
        searchOptions.fullName = new RegExp(req.query.fullName, "i") //i -> case insensitive
    }
    try {
        const costumers = await Costumer.find(searchOptions);
        res.render("costumers/index.ejs", {
            costumers: costumers,
            searchOptions: req.query
        });
    } catch {
        res.redirect("/");
    }
    
})

//New Costumer Route
router.get("/new", (req,res) => {
    res.render("costumers/new.ejs", { costumer: new Costumer()});
})

//Create Costumer Route
router.post("/", async (req, res) => {
    const costumer = new Costumer({
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    });
    try{
        const newCostumer = await costumer.save();
        //res.redirect(`costumers/${newCostumer.id}`);
        res.redirect("costumers");
    } catch{
        res.render("costumers/new", {
            costumer: costumer,
            errorMessage: "Niste pravilno popunili polja"
        })
    }
})

module.exports = router;