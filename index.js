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
app.use("/api/v1/user", require("./routes/userRoute"));

//Waste CRUD routes
app.use("/api/v1/product", require("./routes/wasteRoutes"));

//Pickup routes
app.use("/api/v1/pickup", require("./routes/pickupRoutes"));

//Special requests route
app.use("/api/v1/special-requests", require("./routes/specialRequestRoutes"));

//Payments Route
app.use("/api/v1/payments", require("./routes/paymentsRoutes"));

//defining port
const PORT = process.env.PORT;

//run the server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World Hehe");
});

module.exports = app;
