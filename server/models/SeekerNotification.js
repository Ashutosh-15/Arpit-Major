const mongoose = require("mongoose");

const SeekerNotificationSchema = new mongoose.Schema({
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seeker" },
  type: String,
  message: String,
  relatedBookingId: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SeekerNotification", SeekerNotificationSchema);
