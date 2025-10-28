const Booking = require('../models/booking.model');

exports.create = async (req, res, next) => {
  try {
    const payload = req.body;
    console.log('[booking.controller] create - received payload:', payload);
    const booking = new Booking(payload);
    const saved = await booking.save();
    console.log('[booking.controller] create - saved booking id:', saved._id);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('[booking.controller] create - error saving booking:', err);
    return res.status(500).json({ message: err.message || 'Could not create booking' });
  }
};

exports.list = async (req, res, next) => {
  try {
    const list = await Booking.find().sort({ createdAt: -1 }).limit(100);
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Could not fetch bookings' });
  }
};
