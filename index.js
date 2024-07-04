//importing packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectToDB = require("./database/db");
const cors = require("cors");
const cloudinary = require("cloudinary");
const acceptMultimedia = require("connect-multiparty");
//making express app
const app = express();

//configuring dotenv
dotenv.config();

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//cors config to accept request from frontend
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(acceptMultimedia());

app.use(cors(corsOptions));

//accepting Json Data
app.use(express.json());

//connect to database
connectToDB();

//defining routes

//user routes
app.use("/api/v1/auth/user", require("./routes/authRoutes"));

//Waste CRUD routes
app.use("/api/v1/product", require("./routes/wasteRoutes"));

//Pickup routes

app.use("/api/v1/pickup", require("./routes/pickupRoutes"));

//defining port
const PORT = process.env.PORT;

//run the server

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("This is fohor malai API by Roshan and Ishwar.");
});

module.exports = app;