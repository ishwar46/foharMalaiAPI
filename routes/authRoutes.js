// import
const router = require("express").Router();
const userController = require("../controllers/authController");
const { authGuard, authGuardAdmin } = require("../middleware/authGuard");
const verifyToken = require("../middleware/verifyToken");

// Middleware function to log user creation
const logUserCreation = (req, res, next) => {
  // Call the next middleware immediately to proceed with the user creation
  res.on("finish", () => {
    console.log(`Route: ${req.path} | Status Code: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log("User created successfully");
    } else {
      console.log("User creation failed");
    }
  });
  next();
};

// Middleware function to log user login
const logUserLogin = (req, res, next) => {
  // Call the next middleware immediately to proceed with the user login
  res.on("finish", () => {
    console.log(`Route: ${req.path} | Status Code: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log("User logged in successfully");
    } else {
      console.log(err.message);
    }
  });
  next();
};

// create user
router.post("/create", logUserCreation, userController.createUser);

// login user
router.post("/login", logUserLogin, userController.loginUser);

// exporting
module.exports = router;
