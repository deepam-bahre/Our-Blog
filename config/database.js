// =================================================
//  DATABASE CONNECTION
// =================================================

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Fail fast if database is disconnected instead of hanging
mongoose.set("bufferCommands", false);

const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI;

if (mongoURI) {
  mongoose
    .connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    })
    .then(() => {
      console.log("Database connected successfully to MongoDB");
    })
    .catch((err) => {
      console.warn("MongoDB connection failed — continuing with in-memory store:", err.message);
    });
} else {
  console.log("No MONGODB_URI provided — running with high-performance in-memory fallback store.");
}

module.exports = mongoose;
