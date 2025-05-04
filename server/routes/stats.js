// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Adjust path as per your project
const Provider = require('../models/Provider');
const Seeker = require('../models/Seeker');

// GET time-series data for Bookings, Seekers, Providers
router.get('/timeseries', async (req, res) => {
  try {
    const bookings = await Booking.find();
    const providers = await Provider.find();
    const seekers = await Seeker.find();

    const timeSeriesMap = new Map();

    // Aggregate Bookings
    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const key = date.toISOString().split('T')[0];
      if (!timeSeriesMap.has(key)) {
        timeSeriesMap.set(key, { bookings: 0, seekerCount: 0, providerCount: 0 });
      }
      timeSeriesMap.get(key).bookings += 1;
    });

    // Aggregate Seekers
    seekers.forEach((seeker) => {
      const date = new Date(seeker.createdAt);
      const key = date.toISOString().split('T')[0];
      if (!timeSeriesMap.has(key)) {
        timeSeriesMap.set(key, { bookings: 0, seekerCount: 0, providerCount: 0 });
      }
      timeSeriesMap.get(key).seekerCount += 1;
    });

    // Aggregate Providers
    providers.forEach((provider) => {
      const date = new Date(provider.createdAt);
      const key = date.toISOString().split('T')[0];
      if (!timeSeriesMap.has(key)) {
        timeSeriesMap.set(key, { bookings: 0, seekerCount: 0, providerCount: 0 });
      }
      timeSeriesMap.get(key).providerCount += 1;
    });

    const response = Array.from(timeSeriesMap.entries()).map(([date, counts]) => ({
      date,
      ...counts
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching time series data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
