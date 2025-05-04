const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
  providerName: String,
  services: [String],
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seeker" },
  seekerName: String,
  date: String,
  timeSlot: String,
  address: String,
  paymentMethod: String,
  status: { 
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected','Completed'],
    default: 'Pending',
  }
  
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
