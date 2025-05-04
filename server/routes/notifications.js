const express = require("express");
const router = express.Router();
const ProviderNotification = require("../models/ProviderNotification");
const SeekerNotification = require("../models/SeekerNotification");

// ==============================
// PROVIDER NOTIFICATIONS
// ==============================

// Get all notifications for a provider
router.get("/provider/:providerId", async (req, res) => {
  try {
    const notifications = await ProviderNotification.find({ providerId: req.params.providerId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch provider notifications" });
  }
});

// Mark provider notification as read
router.put("/provider/:id/mark-read", async (req, res) => {
  try {
    await ProviderNotification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});


// ==============================
// SEEKER NOTIFICATIONS
// ==============================

// Get all notifications for a seeker
router.get("/seeker/:seekerId", async (req, res) => {
  try {
    const notifications = await SeekerNotification.find({ seekerId: req.params.seekerId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seeker notifications" });
  }
});

// Mark seeker notification as read
router.put("/seeker/:id/mark-read", async (req, res) => {
  try {
    await SeekerNotification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

module.exports = router;
