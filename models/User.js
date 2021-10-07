const mongoose = require("mongoose"),
  UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: String,
    date: {
      type: Date,
      default: Date.now
    }
  }),
  User = mongoose.model("user", UserSchema);

module.exports = User;
