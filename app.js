// =================================================
//  IMPORTING MODULES
// =================================================
const express = require("express");
const app = express();
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const dotenv = require("dotenv");
dotenv.config();

// Handlebars Setup with Prototype Access Helper
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

// Initialize Database
const mongoose = require("./config/database");
const memoryStore = require("./config/memoryStore");

// =================================================
//  IMPORTING ROUTES & MODELS
// =================================================
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const indexRoutes = require("./routes/index");
const User = require("./models/user");

// =================================================
//  MIDDLEWARES
// =================================================
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Handlebars Engine Configuration
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

// Unified LocalStrategy: checks MongoDB if connected, else checks memoryStore
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (mongoose.connection.readyState === 1) {
        return User.authenticate()(username, password, (err, user, info) => {
          if (err) return done(err);
          if (user) return done(null, user);
          const memUser = memoryStore.verifyUserPassword(username, password);
          if (memUser) return done(null, memUser);
          return done(null, false, info || { message: "Invalid username or password" });
        });
      }

      const memUser = memoryStore.verifyUserPassword(username, password);
      if (memUser) {
        return done(null, memUser);
      }
      return done(null, false, { message: "Invalid username or password" });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  const id = user._id ? String(user._id) : String(user.id);
  done(null, { id, username: user.username });
});

passport.deserializeUser(async (serialized, done) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(serialized.id)) {
      const user = await User.findById(serialized.id);
      if (user) return done(null, user);
    }
    const memUser =
      memoryStore.getUserById(serialized.id) ||
      memoryStore.getUserByUsername(serialized.username);
    if (memUser) {
      return done(null, memUser);
    }
    return done(null, { _id: serialized.id, username: serialized.username });
  } catch (err) {
    return done(null, { _id: serialized.id, username: serialized.username });
  }
});

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

// Route-level fallback for database disconnects
app.use((err, req, res, next) => {
  if (
    err.name === "MongooseError" ||
    err.name === "MongoNetworkError" ||
    (err.message && err.message.includes("buffering timed out"))
  ) {
    console.warn("[AI Studio] Database offline — recovering gracefully:", err.message);
    if (req.method === "GET") {
      return res.redirect("/blogs");
    }
    return res.status(503).json({ error: "Service temporarily unavailable" });
  }
  console.error("Unhandled Application Error:", err);
  res.status(500).render("index", { error: "An unexpected error occurred." });
});

// =================================================
//  SERVER SETUP
// =================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Started at http://0.0.0.0:${PORT}`);
});