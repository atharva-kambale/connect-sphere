// server/models/listingModel.js

const mongoose = require('mongoose');

const listingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category (e.g., Books, Furniture)'],
    },
    
    // --- THIS IS THE UPGRADE ---
    // We changed this from a single String to an Array of Strings
    imageUrls: [
      {
        type: String,
        required: true,
      },
    ],
    // --- END OF UPGRADE ---
    
    university: {
      type: String,
      required: true,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Listing', listingSchema);