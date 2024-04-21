const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    requried: true,
  },
  email: {
    type: String,
    requried: true,
  },
  username: {
    type: String,
    requried: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    requried: false,
  },
  phone: {
    type: String,
    requried: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
