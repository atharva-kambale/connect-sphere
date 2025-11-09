// server/models/userModel.js

const mongoose = require('mongoose');

// 1. Create the Schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    university: {
      type: String,
      required: [true, 'Please add your university'],
    },

    // --- THIS IS THE NEW CODE ---
    rating: {
      type: Number,
      required: true,
      default: 0, // Default to 0 stars
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0, // Default to 0 reviews
    },
    // --- END OF NEW CODE ---
  },
  {
    // 2. Add timestamps
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
  }
);

// 3. Create the Model and Export it
module.exports = mongoose.model('User', userSchema);