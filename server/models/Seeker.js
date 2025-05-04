const mongoose = require("mongoose");

const seekerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["seeker"] },
  profileImage: { type: String, default: "https://i.pravatar.cc/150" }, // Profile pic
  requestedServices: [{ type: String }], // Services they are looking for
  reviewsGiven: [{ 
    providerId: mongoose.Schema.Types.ObjectId, 
    comment: String, 
    rating: Number 
  }], // Reviews they gave to providers
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Seeker", seekerSchema);
