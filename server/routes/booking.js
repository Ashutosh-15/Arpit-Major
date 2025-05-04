const express = require('express');
const Booking = require('../models/Booking');
const SeekerNotification = require('../models/SeekerNotification');
const ProviderNotification = require('../models/ProviderNotification');
const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const bookingId = 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const booking = new Booking({
      ...req.body,
      bookingId,
    });

    console.log('Incoming booking data:', req.body);
    await booking.save();

    const io = req.app.get('io');

    // ✅ Notify provider of a new booking
    if (io && booking.providerId) {
      const providerNotif = new ProviderNotification({
        providerId: booking.providerId,
        type: 'booking',
        message: `New service request from ${booking.seekerName}`,
        relatedBookingId: booking._id,
      });
      await providerNotif.save();

      io.to(booking.providerId.toString()).emit('notification', {
        message: providerNotif.message,
        type: providerNotif.type,
        bookingId: booking._id,
      });
    }

    // ✅ Notify seeker of booking creation
    if (io && booking.seekerId) {
      const seekerNotif = new SeekerNotification({
        seekerId: booking.seekerId,
        type: 'booking-confirmation',
        message: 'Your service request has been placed successfully!',
        relatedBookingId: booking._id,
      });
      await seekerNotif.save();

      io.to(booking.seekerId.toString()).emit('notification', {
        message: seekerNotif.message,
        type: seekerNotif.type,
        bookingId: booking._id,
      });
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Update booking status (accept, reject, complete)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    const io = req.app.get('io');

    if (updated && updated.seekerId) {
      let message = '';
      let type = '';

      if (status === 'accepted') {
        message = 'Your booking was accepted!';
        type = 'booking-accepted';
      } else if (status === 'rejected') {
        message = 'Your booking was rejected.';
        type = 'booking-rejected';
      } else if (status === 'completed') {
        message = 'Service completed. Please leave a review!';
        type = 'leave-review';

        // ✅ Also notify provider that job was marked complete
        const providerNotif = new ProviderNotification({
          providerId: updated.providerId,
          type: 'service-completed',
          message: 'Service completed successfully!',
          relatedBookingId: updated._id,
        });
        await providerNotif.save();

        io.to(updated.providerId.toString()).emit('notification', {
          message: providerNotif.message,
          type: providerNotif.type,
          bookingId: updated._id,
        });
      }

      // Save seeker's notification
      const seekerNotif = new SeekerNotification({
        seekerId: updated.seekerId,
        type,
        message,
        relatedBookingId: updated._id,
      });
      await seekerNotif.save();

      io.to(updated.seekerId.toString()).emit('notification', {
        message,
        type,
        bookingId: updated._id,
      });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// Get all bookings for a seeker
router.get('/seeker/:seekerId', async (req, res) => {
  try {
    const bookings = await Booking.find({ seekerId: req.params.seekerId }).populate('providerId');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get all bookings for a provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.params.providerId }).populate('seekerId');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({ message: 'Error fetching provider bookings' });
  }
});

// Get a single booking by ID
router.get('/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('providerId seekerId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('seekerId providerId');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

router.get('/status-distribution', async (req, res) => {
  const { timeRange, offset } = req.query;

  try {
    // Here you'll calculate date filtering
    let startDate;
    const now = new Date();

    if (timeRange === 'daily') {
      startDate = new Date(now.setDate(now.getDate() - (7 * offset)));
    } else if (timeRange === 'weekly') {
      startDate = new Date(now.setDate(now.getDate() - (7 * 4 * offset)));
    } else if (timeRange === 'monthly') {
      startDate = new Date(now.setMonth(now.getMonth() - offset));
    } else if (timeRange === 'yearly') {
      startDate = new Date(now.setFullYear(now.getFullYear() - offset));
    }

    const query = startDate ? { createdAt: { $gte: startDate } } : {};

    const bookings = await Booking.find(query);

    const statusCounts = {
      Pending: 0,
      Accepted: 0,
      Completed: 0,
      Rejected: 0
    };


    bookings.forEach(booking => {
      if (statusCounts[booking.status] !== undefined) {
        statusCounts[booking.status]++;
      }
    });

    const formattedData = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status],
    }));

    res.json(formattedData);

  } catch (error) {
    console.error('Error fetching status distribution:', error);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
