const express = require("express");
const router = express.Router();
const RentalEvent = require("../models/rentalEvent.js");

//All Rents Route
router.get("/", (req,res) => {
    res.render("rentalEvents/index.ejs")
})

//New Rent Route
router.get("/new", (req,res) => {
    res.send("Nova rent")
})

//Create Rent Route
router.post("/", (req, res) => {
    res.send("pravimo sine")
})

module.exports = router;