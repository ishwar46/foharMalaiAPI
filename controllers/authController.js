//making all the required user
const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/userModel");
const cloudinary = require("cloudinary");

const createUser = async(req, res) => {
    // Check if data is coming or not
    console.log(req.body);

    // Destructure data
    const { firstName, lastName, email, password, address, username, phone } =
    req.body;
    const { image } = req.files;

    // Validate the incoming data
    if (!firstName ||
        !lastName ||
        !email ||
        !password ||
        !address ||
        !username ||
        !phone
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter the required fields.",
        });
    }

    let imageUrl = null;

    try {
        if (image) {
            const userImage = await cloudinary.v2.uploader.upload(image.path, {
                folder: "herchaha/users",
                crop: "crop",
            });
            imageUrl = userImage.secure_url;
        }

        // Check existing user
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists",
            });
        }

        // Password encryption
        const randomSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, randomSalt);

        // Create a new user
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: encryptedPassword,
            address: address,
            username: username,
            phone: phone,
            image: imageUrl,
        });

        // Save the user
        await newUser.save();

        res.status(200).json({
            success: true,
            message: "User created successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// const createUser = async (req, res) => {
//   //step: 1 Check if data is coming or not
//   console.log(req.body);

//   //step 2: destructure data
//   const { firstName, lastName, email, password, address, username, phone } =
//     req.body;

//   //step 3: validate the incoming data
//   if (
//     !firstName ||
//     !lastName ||
//     !email ||
//     !password ||
//     !address ||
//     !username ||
//     !phone
//   ) {
//     return res.status(400).json({
//       success: false,
//       message: "Please enter the required fields.",
//     });
//   }

//   //step 4: try catch
//   try {
//     //step 5 : check existing user
//     const existingUser = await Users.findOne({ email: email });
//     if (existingUser) {
//       return res.json({
//         success: false,
//         message: "User already exist",
//       });
//     }
//     //password encryption
//     const randomSalt = await bcrypt.genSalt(10);
//     const encryptedPassword = await bcrypt.hash(password, randomSalt);

//     //step 6: create a new user
//     const newUser = new Users({
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       password: encryptedPassword,
//       address: address,
//       username: username,
//       phone: phone,
//     });

//     //step7: save uuser and response
//     await newUser.save();
//     res.status(200).json({
//       success: true,
//       message: "User created successfully.",
//     });
//   } catch (error) {
//     res.status(500).json("Server Error");
//   }
// };

//**********Login User

const loginUser = async(req, res) => {
    // step 1: Check incomming data
    console.log(req.body);

    // destructuring
    const { username, password } = req.body;

    // validation
    if (!username || !password) {
        return res.json({
            success: false,
            message: "Please enter all fields.",
        });
    }

    // try catch block
    try {
        // finding user
        const user = await Users.findOne({ username: username });
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exists.",
            });
        }

        // user exists:  {FirstName, LastName, Email, Password} user.password
        // Comparing password
        const databasePassword = user.password;
        const isMatched = await bcrypt.compare(password, databasePassword);

        if (!isMatched) {
            return res.json({
                success: false,
                message: "Invalid Credentials.",
            });
        }

        // create token
        const token = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
                username: user.username,
                image: user.image,
            },
            process.env.JWT_SECRET, { expiresIn: "6hr" }
        );

        // response
        res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            token: token,
            userData: user,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: message,
            error: error,
        });
    }
};

// get all users with pagination
const getAllUsers = async(req, res) => {
    try {
        // Extract user role from the request
        const userRole = req.user.isAdmin; // Assuming isAdmin field is present in the JWT payload

        // Check if the user is an admin
        if (!userRole) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access. Only admin users are allowed.",
            });
        }

        // Limiting query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query._limit) || 10;
        const skip = (page - 1) * limit;

        const users = await Users.find({}).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            message: "All users fetched successfully.",
            count: users.length,
            page: page,
            limit: limit,
            users: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};

//User Profile
const getUserProfile = async(req, res) => {
    try {
        // Extract user ID from the request
        const userId = req.params.userId;

        // Fetch the user's profile data based on the user ID
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Exclude the password field from the user object
        const userProfile = {...user.toObject() };
        delete userProfile.password;
        // Return user profile data without the password
        res.status(200).json({
            success: true,
            message: "User profile fetched successfully.",
            userProfile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

//edit user profile
const editUserProfile = async(req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (req.files && req.files.image) {
            const userImage = await cloudinary.v2.uploader.upload(
                req.files.image.path, {
                    folder: "herchaha/users",
                    crop: "crop",
                }
            );
            user.image = userImage.secure_url;
        }

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.username = req.body.username;
        user.phone = req.body.phone;
        user.address = req.body.address;

        // Save the updated user profile
        await user.save();

        res.status(200).json({
            success: true,
            message: "User profile updated successfully.",
            updatedUserProfile: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUserProfile,
    editUserProfile,

};