const mongoose = require("mongoose"),

      contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    contactNo: Number,
    feedback: String,
    time: {
      type: Date,
      default: Date.now,
    }
  });

  // Export Our Contact Model
  module.exports = mongoose.model("Contact", contactSchema);