const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  room: { type: String, required: true },
  duration: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'UPI'], default: 'Cash' },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  // Optional transaction number/id for UPI or other digital payments
  transactionNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
