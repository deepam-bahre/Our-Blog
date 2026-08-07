const router = require("express").Router();
const passport = require("passport");
const UserController = require("../controllers/user");

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
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

// Handles User Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully.");
    res.redirect("/");
  });
});

module.exports = router;