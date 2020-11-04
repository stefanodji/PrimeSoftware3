require("dotenv").config();

const express = require("express");
const app = express();

const expressLayouts = require("express-ejs-layouts");

const bodyParser = require("body-parser");

const methodOverride = require("method-override");


const indexRouter = require("./routes/index");
const costumerRouter = require("./routes/costumer");
const vehicleRouter = require("./routes/vehicle");
const rentalEvent = require("./routes/rentEvent.js");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({limit: "50mb", extended:false}));
app.use(methodOverride("_method"));

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to the database"));



app.use("/", indexRouter);
app.use("/costumers", costumerRouter);
app.use("/vehicles", vehicleRouter);
app.use("/rentalEvents", rentalEvent);


app.listen(3000);