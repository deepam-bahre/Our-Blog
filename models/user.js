const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Handles both ES Module (.default) and traditional CommonJS exports
const passportPlugin = passportLocalMongoose.default || passportLocalMongoose;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  // 'username', 'hash', and 'salt' are handled automatically by passportLocalMongoose
});

// Attach the plugin
userSchema.plugin(passportPlugin);

module.exports = mongoose.model("User", userSchema);