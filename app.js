// =================================================
//  IMPORTING MODULES
// =================================================
const express = require("express");
const app = express();
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
dotenv.config();

// Handlebars Setup with Prototype Access Helper
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

// =================================================
//  IMPORTING ROUTES & MODELS
// =================================================
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const indexRoutes = require("./routes/index");
const User = require("./models/user");

// Initialize Database
require("./config/database");

// =================================================
//  MIDDLEWARES
// =================================================
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Handlebars Engine Configuration (Fixes prototype access issue)
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "A Secret Monkey With A Secret Hat",
    resave: false,
    saveUninitialized: false,
  })
);

// Flash Messages
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Locals Middleware
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user;
  next();
});

// =================================================
//  ROUTES
// =================================================
app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/users", userRoutes);

// =================================================
//  SERVER SETUP
// =================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});