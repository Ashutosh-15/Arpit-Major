const express = require('express');
const router = express.Router();


// Import your models
const Seeker = require('../models/Seeker');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Review = require('../models/Reviews');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (You can add admin auth later)
router.get('/stats', async (req, res) => {
  try {
    const seekersCount = await Seeker.countDocuments();
    const providersCount = await Provider.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    res.status(200).json({
      seekers: seekersCount,
      providers: providersCount,
      totalBookings: totalBookings,
      totalReviews: totalReviews,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/users', async (req, res) => {
  try {
    const seekers = await Seeker.find().lean();
    const providers = await Provider.find().lean();

    const users = [...seekers, ...providers];

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;