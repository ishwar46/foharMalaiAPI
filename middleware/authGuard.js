let jwt = require("jsonwebtoken");
const User = require("../model/userModel");

let authGuard = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;
    //console.log(authHeader, "this is authHeader");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing!",
      });
    }

    let token = authHeader.split(" ")[1];
    token = token.replace("Bearer ", "");
    //console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing!",
      });
    }

    let decodedData = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decodedData, "this is usedecvocxdeshgfhjgasdfr");
    let user = await User.findById(decodedData.id);
    //console.log(user, "this is user");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    //console.log(error, "this is error");
    res.status(401).json({
      success: false,
      message: "Invalid token!",
    });
  }
};

const authGuardAdmin = async (req, res, next) => {
  try {
    // check if auth header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing!",
      });
    }

    // split auth header and get token
    // Format: 'Bearer ghfdrgthyuhgvfghjkiujhghjuhjg'
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing!",
      });
    }

    // verify token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;

    // If user is not admin and is trying to access their own profile, allow access
    if (!req.user.isAdmin && req.params.userId === req.user.id) {
      return next();
    }

    // // Otherwise, check if user is admin
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Permission denied!",
    //   });
    // }

    // If user is admin, allow access
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  authGuard,
  authGuardAdmin,
};
