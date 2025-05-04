const mongoose = require("mongoose");
require("dotenv").config();

function connectDB() {
  const dbURI = process.env.MONGO_URI;
  mongoose.connect(dbURI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

module.exports = {connectDB};