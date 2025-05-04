// const express = require("express");
// const router = express.Router();
// const Message = require("../models/Message");
// const Booking = require("../models/Booking");

// // ============================================================
// // 📨 1. Save a new message
// // ============================================================
// router.post("/send", async (req, res) => {
//   const { bookingId, senderId, receiverId, message } = req.body;

//   try {
//     const newMessage = new Message({
//       bookingId,
//       senderId,
//       receiverId,
//       message,
//     });

//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (err) {
//     console.error("❌ Error saving message:", err.message);
//     res.status(500).json({ error: "Failed to save message" });
//   }
// });

// // ============================================================
// // 📥 2. Get all chat messages for a specific booking
// // ============================================================
// router.get("/:bookingId", async (req, res) => {
//   const { bookingId } = req.params;

//   try {
//     const messages = await Message.find({ bookingId }).sort({ createdAt: 1 });
//     res.status(200).json(messages);
//   } catch (err) {
//     console.error("❌ Error fetching messages:", err.message);
//     res.status(500).json({ error: "Failed to fetch messages" });
//   }
// });

// // ============================================================
// // 📇 3. Get active chat contacts for a user (Seeker or Provider)
// // ============================================================
// router.get("/contacts/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Fetch bookings for the user with status 'accepted'
//     const bookings = await Booking.find({
//       $or: [{ seekerId: userId }, { providerId: userId }],
//       status: { $in: ["accepted"] },  // Only accepted bookings for active chats
//     }).sort({ updatedAt: -1 });

//     console.log("Bookings found for user:", bookings);  // Log the fetched bookings

//     const chatContacts = bookings.map((booking) => {
//       const isSeeker = booking.seekerId.toString() === userId;
      
//       return {
//         userId: isSeeker ? booking.providerId : booking.seekerId,
//         name: isSeeker ? booking.providerName : booking.seekerName,
//         avatar: isSeeker ? booking.providerAvatar : booking.seekerAvatar,
//         bookingId: booking._id,
//         service: booking.services?.[0]?.category || "Service",  // Default to "Service" if undefined
//         lastUpdated: booking.updatedAt,
//       };
//     });

//     console.log("Contacts created from bookings:", chatContacts);  // Log the generated contacts

//     res.status(200).json(chatContacts);  // Send the contacts as the response
//   } catch (err) {
//     console.error("Error fetching chat contacts:", err.message);
//     res.status(500).json({ error: "Failed to fetch chat contacts" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Booking = require("../models/Booking");

// ============================================================
// 📨 1. Save a new message and emit via Socket.io
// ============================================================
router.post("/send", async (req, res) => {
  const { bookingId, senderId, receiverId, message } = req.body;

  try {
    const newMessage = new Message({
      bookingId,
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    // ✅ Emit real-time message to the receiver using socket.io
    const io = req.app.get("io");
    if (io && receiverId) {
      io.to(receiverId.toString()).emit("new-message", {
        bookingId,
        senderId,
        receiverId,
        message,
        createdAt: newMessage.createdAt,
      });
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error saving message:", err.message);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// ============================================================
// 📥 2. Get all chat messages for a specific booking
// ============================================================
router.get("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    const messages = await Message.find({ bookingId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ============================================================
// 📇 3. Get active chat contacts for a user (Seeker or Provider)
// ============================================================
router.get("/contacts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({
      $or: [{ seekerId: userId }, { providerId: userId }],
      status: "accepted",
    }).sort({ updatedAt: -1 });

    const chatContacts = bookings.map((booking) => {
      const isSeeker = booking.seekerId.toString() === userId;

      return {
        userId: isSeeker ? booking.providerId : booking.seekerId,
        name: isSeeker ? booking.providerName || "Provider" : booking.seekerName || "Seeker",
        avatar: isSeeker ? booking.providerAvatar || "" : booking.seekerAvatar || "",
        bookingId: booking._id,
        service: booking.services?.[0]?.category || "Service",
        lastUpdated: booking.updatedAt,
      };
    });

    res.status(200).json(chatContacts);
  } catch (err) {
    console.error("❌ Error fetching chat contacts:", err.message);
    res.status(500).json({ error: "Failed to fetch chat contacts" });
  }
});

module.exports = router;
