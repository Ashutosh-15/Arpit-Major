


const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const User = require("../models/Seeker");
const Provider = require("../models/Provider");
const { signup, login } = require("../controllers/authcontroller");

const router = express.Router();

// Configure Multer for Aadhaar card image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Test route: Add Seeker (You can remove this if unnecessary)
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Seeker Signup and Login
router.post("/signup", signup);
router.post("/login", login);

// Provider Signup with Aadhaar Card Image Upload
router.post("/register/provider", upload.single("aadhaarCardImage"), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      address,
      profileImage,
      experience,
      availability,
      services,
    } = req.body;

    // Check if provider already exists
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: "Provider already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new provider
    const newProvider = new Provider({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      profileImage,
      experience,
      availability,
      services,
      aadhaarCardImage: req.file ? req.file.filename : null,
    });

    await newProvider.save();

    res.status(201).json({ message: "Provider registered successfully", provider: newProvider });
  } catch (error) {
    console.error("Error during provider registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
