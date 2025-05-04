const mongoose = require("mongoose");


const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },

  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["provider"] },

  aadhaarCardNumber: { type: String, required: true, unique: true },
  // aadhaarCardImage: { type: String }, // Uncomment if needed for image upload

  experience: { type: String, required: true },
  availability: { type: String, default: "Available" }, // NEW FIELD

  services: [{ type: String, required: true }], // Array of service categories
  profileImage: {
    type: String,
    default: "https://i.pravatar.cc/150", // Placeholder image
  },

  rating: { type: Number, default: 0 },
  reviewCount: {type: Number,default: 0 },
  

  createdAt: { type: Date, default: Date.now },
});



// ✅ Export Provider model
module.exports = mongoose.model("Provider", providerSchema);
