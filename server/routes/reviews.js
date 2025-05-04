const express = require('express');
const router = express.Router();
const Review = require('../models/Reviews');
const Booking = require('../models/Booking');

// POST /api/reviews/:bookingId
router.post('/:bookingId', async (req, res) => {
    const { rating, comment } = req.body;
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status !== 'completed') return res.status(400).json({ message: 'Service not completed' });

        const existing = await Review.findOne({ bookingId });
        if (existing) return res.status(400).json({ message: 'Review already submitted for this booking' });

        const review = new Review({
            bookingId,
            seekerId: booking.seekerId,
            providerId: booking.providerId,
            rating,
            comment,
        });

        await review.save();
        res.status(201).json({ message: 'Review submitted', review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/reviews/provider/:providerId
router.get('/provider/:providerId', async (req, res) => {
    try {
        const reviews = await Review.find({ providerId: req.params.providerId }).sort({ createdAt: -1 });
        res.status(200).json({ reviews });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// GET /api/reviews/seeker/:seekerId
router.get('/seeker/:seekerId', async (req, res) => {
    try {
      const reviews = await Review.find({ seekerId: req.params.seekerId }).sort({ createdAt: -1 });
      res.status(200).json({ reviews });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch seeker reviews' });
    }
  });
  
// GET /api/reviews/:bookingId
router.get('/get-reviews/:bookingId', async (req, res) => {
    try {
        const review = await Review.findOne({ bookingId: req.params.bookingId });
        if (!review) return res.status(404).json({ message: 'No review found' });
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch review' });
    }
});


// PUT /api/reviews/:bookingId
router.put('/:bookingId', async (req, res) => {
    const { rating, comment } = req.body;
    const { bookingId } = req.params;

    try {
        const review = await Review.findOneAndUpdate(
            { bookingId },
            { rating, comment },
            { new: true }
        );

        if (!review) return res.status(404).json({ message: 'Review not found' });

        res.status(200).json({ message: 'Review updated', review });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/all', async (req, res) => {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.status(200).json({ reviews });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch all reviews' });
    }
  });

// GET /api/users/:id
// router.get('/:id', async (req, res) => {
//     try {
//       const user = await User.findById(req.params.id);
//       if (!user) return res.status(404).json({ message: 'User not found' });
//       res.status(200).json(user);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Failed to fetch user' });
//     }
//   });
  


module.exports = router;
