// server/models/otpModel.js

const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // This is magic! MongoDB will auto-delete this document after 600 seconds (10 minutes)
  },
});

module.exports = mongoose.model('Otp', otpSchema);