// server/models/reviewModel.js

const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    // The user who *wrote* the review (the author)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The user *being reviewed* (the seller)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The 5-star rating
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // The text comment
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
    // The listing this review is associated with
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Listing',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);