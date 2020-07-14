// Importing Express Router and Passport
const router = require("express").Router();
const passport = require("passport");

// Importing User Model
const User = require("../models/user");

// Importing User Controllers
const UserController = require('../controllers/user');

// =================================================
//  REGISTRATION ROUTES
// =================================================

// Loads Register View
router.get("/register", (req, res) => {
  res.render("user/register");
});

// Handles User Register
router.post("/register", UserController.register);

// =================================================
//  LOGIN / LOGOUT ROUTES
// =================================================

// Loads Login View
router.get("/login", (req, res) => {
  res.render("user/login");
});

// Handles User Login
router.post("/login",passport.authenticate("local", {
    //successFlash: 'Logged in.',
    successRedirect: "/",
    //failureFlash: 'Username or password is invalid.',
    failureRedirect: "/users/login",
  }),
  (req, res) => {
    // Code Body Empty
  }
);

// Handles User Logout
router.get("/logout", (req, res) => {
  req.logout();
  //req.flash('success', 'Logged out.');
  res.redirect("/");
});

// Exports Our User Routes
module.exports = router;
