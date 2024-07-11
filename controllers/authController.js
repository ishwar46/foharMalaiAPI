//making all the required user
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/userModel");
const cloudinary = require("cloudinary");

const createUser = async(req, res) => {
    try {
        // Check if data is coming or not
        console.log(req.body);

        // Destructure data
        const { fullName, email, password, address, username, mobileNo } = req.body;
        const { image } = req.files;

        // Validate the incoming data
        if (!fullName ||
            !email ||
            !password ||
            !address ||
            !username ||
            !mobileNo
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required fields.",
            });
        }

        let imageUrl = null;

        try {
            if (image) {
                const userImage = await cloudinary.uploader.upload(image.path, {
                    folder: "foharmalai/users",
                    crop: "crop",
                });
                imageUrl = userImage.secure_url;
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image.",
                error: error.message,
            });
        }

        try {
            // Check existing user
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "User with the same email already exists.",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to check existing user.",
                error: error.message,
            });
        }

        let encryptedPassword;
        try {
            // Password encryption
            const randomSalt = await bcrypt.genSalt(10);
            encryptedPassword = await bcrypt.hash(password, randomSalt);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to encrypt password.",
                error: error.message,
            });
        }

        try {
            // Create a new user
            const newUser = new User({
                fullName: fullName,
                email: email,
                password: encryptedPassword,
                address: address,
                username: username,
                mobileNo: mobileNo,
                image: imageUrl,
            });

            // Save the user
            await newUser.save();

            res.status(201).json({
                success: true,
                message: "User created successfully.",
                data: newUser,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create user.",
                error: error.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error.",
            error: error.message,
        });
    }
};

// Login User
const loginUser = async(req, res) => {
    try {
        // Step 1: Check incoming data
        console.log(req.body);

        // Destructuring
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields.",
            });
        }

        try {
            // Finding user
            const user = await User.findOne({ username: username });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User does not exist.",
                });
            }

            try {
                // Comparing password
                const databasePassword = user.password;
                const isMatched = await bcrypt.compare(password, databasePassword);

                if (!isMatched) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials.",
                    });
                }

                // Create token
                const token = jwt.sign({
                        id: user._id,
                        isAdmin: user.isAdmin,
                        fullName: user.fullName,
                        image: user.image,
                        username: user.username,
                    },
                    process.env.JWT_SECRET, { expiresIn: "12hr" }
                );

                // Response
                res.status(200).json({
                    success: true,
                    message: "User logged in successfully.",
                    token: token,
                    userData: {
                        _id: user._id,
                        fullName: user.fullName,
                        username: user.username,
                        isAdmin: user.isAdmin,
                        image: user.image,
                    },
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to compare password.",
                    error: error.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to find user.",
                error: error.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error.",
            error: error.message,
        });
    }
};

module.exports = {
    createUser,
    loginUser,
};