const User = require("../models/user");

// Handles User Registration
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });

    await User.register(newUser, password);

    req.flash("success", "Registration successful! Please log in.");
    return res.redirect("/users/login");
  } catch (err) {
    req.flash("error", err.message || "Failed to register.");
    return res.redirect("/users/register");
  }
};

module.exports = { register };