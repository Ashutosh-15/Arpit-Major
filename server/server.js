const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { connectDB } = require('./connection') // Import the connection file

// Load environment variables
dotenv.config();

// Express App Initialization
const app = express();
const server = http.createServer(app); // Attach HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins during development
    methods: ["GET", "POST"],
  },
});

// Make io accessible to routes
app.set("io", io);

// Connect to MongoDB
connectDB();


// ===== Middleware =====
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json());
app.use(bodyParser.json());

// ===== Static File Serving (e.g., Aadhaar uploads) =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== API Routes =====
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const bookingRoutes = require("./routes/booking");
const chatRoutes = require("./routes/chat");
const notificationRoutes = require("./routes/notifications");
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const statsRoutes = require('./routes/stats');
//const userRoutes = require('./routes/users')


app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
//app.use('/api/users', userRoutes );


// ======== SOCKET.IO EVENTS START HERE ======== //
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // ===================== 🔔 Real-time Booking Notifications =====================
  socket.on("join", (userId) => {
    socket.join(userId); // Each user joins their own room by userId

  });

  // Send notification to specific user (e.g., after a booking is made)
  socket.on("sendNotification", ({ userId, notification }) => {
    io.to(userId).emit("receiveNotification", notification);
  });

  // ===================== 💬 Chat System Per Booking =====================
  socket.on("joinRoom", (bookingId) => {
    socket.join(bookingId); // Join chat room specific to booking ID
    console.log(`💬 User joined chat room for booking ${bookingId}`);
  });

  socket.on("sendMessage", (msg) => {
    const { receiverId } = msg;

    // Emit to receiver by their userId (matching frontend socket.emit("join", userId))
    io.to(receiverId).emit("receiveMessage", msg);
  });


  // ===================== General Logging =====================
  socket.onAny((event, ...args) => {
    console.log("📡 Event received:", event, args);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});
// ======== SOCKET.IO EVENTS END HERE ======== //

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
