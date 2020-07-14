// Importing Express Router and Passport
const router = require("express").Router();
const passport = require("passport");

// Importing User Model
const User = require("../models/user");


// =================================================
//  REGISTRATION ROUTES
// =================================================


// Handles User Register
const register= (req, res, next) => {
  let { username, email, password } = req.body;

  const newUser = new User({
    username,
    email,
  });

  User.register(newUser, password)
    .then((user) => {
      //req.flash('success', 'Registration successful, please login.')
      res.redirect("/users/login");
    })
    .catch((err) => {
      //req.flash('error', 'Failed to register.');
      res.redirect("/users/register");
    });
};

// Exports Our User Routes
module.exports = { register };
