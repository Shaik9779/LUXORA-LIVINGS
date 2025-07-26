const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {            // ✅ ADD THIS FIELD
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passportLocalMongoose); // this adds password hashing, etc.

module.exports = mongoose.model("User", userSchema);
