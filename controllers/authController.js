//making all the required user
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/userModel");
const cloudinary = require("cloudinary");

const createUser = async (req, res) => {
  // Check if data is coming or not
  console.log(req.body);

  // Destructure data
  const { firstName, lastName, email, password, address, username, mobileNo } =
    req.body;
  const { image } = req.files;

  // Validate the incoming data
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !address ||
    !username ||
    !mobileNo
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
        folder: "foharmalai/users",
        crop: "crop",
      });
      imageUrl = userImage.secure_url;
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User with same email already exists",
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
      mobileNo: mobileNo,
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

//**********Login User

const loginUser = async (req, res) => {
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
    const user = await User.findOne({ username: username });
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
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNo: user.mobileNo,
        address: user.address,
        username: user.username,
        image: user.image,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6hr" }
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

module.exports = {
  createUser,
  loginUser,
};
