const express = require("express");
const path = require("path");
const multer = require("multer");
const Provider = require("../models/Provider");
const Seeker = require("../models/Seeker");

const router = express.Router();

// 🧰 Multer config (currently not used but ready for future image handling)
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/* ---------------------- GET Routes ---------------------- */

// ✅ Get a specific provider profile by ID
router.get("/provider/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).lean();
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get a specific seeker profile by ID
router.get("/seeker/:id", async (req, res) => {
  try {
    const seeker = await Seeker.findById(req.params.id).lean();
    if (!seeker) return res.status(404).json({ message: "Seeker not found" });
    res.json(seeker);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get filtered providers (used for "Find Services" page)
router.get("/providers", async (req, res) => {
  try {
    const { category, area, availability } = req.query;

    const query = {};

    if (category) {
      query.services = { $elemMatch: { $regex: new RegExp(category, "i") } };
    }

    if (area) {
      query.address = { $regex: area, $options: "i" }; // case-insensitive partial match
    }

    if (availability) {
      query.availability = availability;
    }

    const providers = await Provider.find(query).lean();
    res.json(providers);
  } catch (err) {
    console.error("Error fetching providers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ---------------------- PUT Routes ---------------------- */

// ✅ Update Provider Profile
router.put("/provider/:id", async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phoneNumber",
      "address",
      "experience",
      "availability",
      "services",
      "profileImage"
    ];

    const updatedData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updatedData[field] = req.body[field];
    });

    const updatedProvider = await Provider.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProvider) return res.status(404).json({ message: "Provider not found" });
    res.json(updatedProvider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update Seeker Profile
router.put("/seeker/:id", async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phoneNumber",
      "address",
      "profileImage"
    ];

    const updatedData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updatedData[field] = req.body[field];
    });

    const updatedSeeker = await Seeker.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedSeeker) return res.status(404).json({ message: "Seeker not found" });
    res.json(updatedSeeker);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid input data", details: err.errors });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update Provider Rating and Review Count
router.put("/provider/:id/rating", async (req, res) => {
  try {
    const { rating, reviewCount } = req.body;

    // Validate input
    if (rating === undefined || reviewCount === undefined) {
      return res.status(400).json({ message: "Rating and reviewCount are required" });
    }

    // Find provider by ID and update the rating and review count
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.params.id,
      { rating, reviewCount },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(updatedProvider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;


// const express = require("express");
// const path = require("path");
// const multer = require("multer");
// const Provider = require("../models/Provider");
// const Seeker = require("../models/Seeker");

// const router = express.Router();

// // 🧰 Multer config (currently not used but ready for future image handling)
// const storage = multer.memoryStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });

// /* ---------------------- GET Routes ---------------------- */

// // ✅ Get a specific provider profile by ID
// router.get("/provider/:id", async (req, res) => {
//   try {
//     const provider = await Provider.findById(req.params.id).lean();
//     if (!provider) return res.status(404).json({ message: "Provider not found" });
//     res.json(provider);
//   } catch (err) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ Get a specific seeker profile by ID
// router.get("/seeker/:id", async (req, res) => {
//   try {
//     const seeker = await Seeker.findById(req.params.id).lean();
//     if (!seeker) return res.status(404).json({ message: "Seeker not found" });
//     res.json(seeker);
//   } catch (err) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ Get filtered providers (used for "Find Services" page)
// router.get("/providers", async (req, res) => {
//   try {
//     const { category, area, availability } = req.query;

//     const query = {};

//     if (category) {
//       query.services = { $elemMatch: { $regex: new RegExp(category, "i") } };
//     }

//     if (area) {
//       query.address = { $regex: area, $options: "i" }; // case-insensitive partial match
//     }

//     if (availability) {
//       query.availability = availability;
//     }

//     const providers = await Provider.find(query).lean();
//     res.json(providers);
//   } catch (err) {
//     console.error("Error fetching providers:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// /* ---------------------- PUT Routes ---------------------- */

// // ✅ Update Provider Profile
// router.put("/provider/:id", async (req, res) => {
//   try {
//     const allowedFields = [
//       "name",
//       "email",
//       "phoneNumber",
//       "address",
//       "experience",
//       "availability",
//       "services",
//       "profileImage"
//     ];

//     const updatedData = {};
//     allowedFields.forEach((field) => {
//       if (req.body[field] !== undefined) updatedData[field] = req.body[field];
//     });

//     const updatedProvider = await Provider.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       { new: true, runValidators: true }
//     ).lean();

//     if (!updatedProvider) return res.status(404).json({ message: "Provider not found" });
//     res.json(updatedProvider);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ Update Seeker Profile
// router.put("/seeker/:id", async (req, res) => {
//   try {
//     const allowedFields = [
//       "name",
//       "email",
//       "phoneNumber",
//       "address",
//       "profileImage"
//     ];

//     const updatedData = {};
//     allowedFields.forEach((field) => {
//       if (req.body[field] !== undefined) updatedData[field] = req.body[field];
//     });

//     const updatedSeeker = await Seeker.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       { new: true, runValidators: true }
//     ).lean();

//     if (!updatedSeeker) return res.status(404).json({ message: "Seeker not found" });
//     res.json(updatedSeeker);
//   } catch (err) {
//     if (err.name === "ValidationError") {
//       return res.status(400).json({ error: "Invalid input data", details: err.errors });
//     }
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;
