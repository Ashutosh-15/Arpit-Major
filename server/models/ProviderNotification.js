const mongoose = require("mongoose");

const ProviderNotificationSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
  type: String,
  message: String,
  relatedBookingId: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProviderNotification", ProviderNotificationSchema);
