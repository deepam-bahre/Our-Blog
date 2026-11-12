const mongoose = require("mongoose");
const User = require("../models/user");
const memoryStore = require("../config/memoryStore");

// Handles User Registration
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      req.flash("error", "Username and password are required.");
      return res.redirect("/users/register");
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const newUser = new User({ username, email });
        await User.register(newUser, password);
        req.flash("success", "Registration successful! Please log in.");
        return res.redirect("/users/login");
      } catch (dbErr) {
        // If it's a validation error like user already exists, throw it
        if (dbErr.name === "UserExistsError" || dbErr.message.includes("already registered")) {
          throw dbErr;
        }
        console.warn("MongoDB registration error, using memory fallback:", dbErr.message);
      }
    }

    // In-memory registration fallback
    memoryStore.registerUser({ username, email, password });
    req.flash("success", "Registration successful! Please log in.");
    return res.redirect("/users/login");
  } catch (err) {
    req.flash("error", err.message || "Failed to register.");
    return res.redirect("/users/register");
  }
};

module.exports = { register };