const express = require("express");
const Costumer = require("../models/costumer.js");
const router = express.Router();



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
        res.redirect(`costumers/${newCostumer.id}`);
    } catch{
        res.render("costumers/new", {
            costumer: costumer,
            errorMessage: "Niste pravilno popunili polja"
        })
    }
})

router.get("/:id", async (req, res) => { //Ovo id mora posle new, u suprotnom ce pomisliti da je new id hehe
    try {
        const costumer = await Costumer.findById(req.params.id);
        res.render("costumers/show.ejs", {costumer: costumer});
    } catch {
        res.redirect("/costumers");
    }
})

router.get("/:id/edit", async (req, res) => {
    try {
        const costumer = await Costumer.findById(req.params.id);
        res.render("costumers/edit.ejs", { costumer: costumer});
    } catch {
        res.redirect("/costumers");
    }
})

router.put("/:id", async (req, res) => {
    let costumer;
    try{
        costumer = await Costumer.findById(req.params.id);
        costumer.fullName = req.body.fullName;
        costumer.email = req.body.email;
        costumer.phoneNumber = req.body.phoneNumber;
        await costumer.save();
        res.redirect(`/costumers/${costumer.id}`);
    } catch{
        if(costumer == null){
            res.redirect("/costumers");
        }
        else{
            res.render("costumers/edit", {
                costumer: costumer,
                errorMessage: "Doslo je do greske u cuvanju podataka :/"
            })
        }
        
    }
})

router.delete("/:id", async (req, res) => { //Nikad GET za DELETE heheh
    let costumer;
    try{
        costumer = await Costumer.findById(req.params.id);
        await costumer.remove();
        res.redirect("/costumers/");
    } catch{
        if(costumer == null){
            res.redirect("/");
        }
        else{
            res.redirect(`/costumers/${req.params.id}`);
        }
        
    }
})

module.exports = router;