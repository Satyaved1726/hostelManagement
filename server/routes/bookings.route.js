const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// POST /api/bookings
router.post('/', bookingController.create);
// GET /api/bookings
router.get('/', bookingController.list);

module.exports = router;
