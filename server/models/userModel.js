// server/models/userModel.js

const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    university: {
      type: String,
      required: [true, 'Please add your university'],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },

    // --- THIS IS THE NEW CODE ---
    profilePictureUrl: {
      type: String,
      // A default generic avatar
      default: 'https://i.imgur.com/6VBx3io.png', 
    },
    bannerImageUrl: {
      type: String,
      // A default generic banner
      default: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1793&auto=format&fit=crop', 
    },
    // --- END OF NEW CODE ---
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);