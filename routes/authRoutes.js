const router = require("express").Router();
const userController = require("../controllers/authController");
const { authGuard } = require("../middleware/authGuard");

//Middleware function to log user creation
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
        } else if (res.statusCode >= 400) {
            console.log("User login failed");
        }
    });
    next();
};

// create user
router.post("/register", logUserCreation, userController.createUser);

// login user
router.post("/login", logUserLogin, userController.loginUser);

// exporting
module.exports = router;