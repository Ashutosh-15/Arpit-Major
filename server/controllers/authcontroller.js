const Seeker = require('../models/Seeker');
const Provider = require('../models/Provider');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      location,
      userType,
      experience,
      aadharCard,
    } = req.body;

    if (!fullName || !email || !phone || !location || !userType || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (userType === "provider" && (!experience || !aadharCard)) {
      return res.status(400).json({ message: "Experience and Aadhaar Card are required for providers" });
    }

    const emailTrimmed = email.trim().toLowerCase();

    const existingUser =
      userType === "seeker"
        ? await Seeker.findOne({ email: emailTrimmed })
        : await Provider.findOne({ email: emailTrimmed });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    let newUser;

    if (userType === "seeker") {
      newUser = new Seeker({
        name: fullName,
        email: emailTrimmed,
        password: hashedPassword,
        phoneNumber: phone,
        address: location,
        role: userType,
      });
    } else {
      newUser = new Provider({
        name: fullName,
        email: emailTrimmed,
        password: hashedPassword,
        phoneNumber: phone,
        address: location,
        role: userType,
        experience,
        aadhaarCardNumber: aadharCard,
      });
    }

    await newUser.save();

    const payload = {
      user: {
        id: newUser._id,
        userType,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        userType,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const emailTrimmed = email.trim().toLowerCase();

    const user =
      userType === "seeker"
        ? await Seeker.findOne({ email: emailTrimmed })
        : await Provider.findOne({ email: emailTrimmed });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user._id,
        userType,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        userType,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
