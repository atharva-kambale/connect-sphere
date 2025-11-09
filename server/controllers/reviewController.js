// server/controllers/reviewController.js

const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel.js');
const User = require('../models/userModel.js');

// @desc    Create a new review
// @route   POST /api/reviews/:sellerId
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, listingId } = req.body;
  const sellerId = req.params.sellerId;
  const authorId = req.user._id;

  // 1. Check if user is trying to review themselves
  if (sellerId === authorId.toString()) {
    res.status(400);
    throw new Error('You cannot review yourself');
  }

  // 2. Check if user has already reviewed this listing
  const alreadyReviewed = await Review.findOne({
    listing: listingId,
    author: authorId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this listing');
  }

  // 3. Create the new review
  const review = new Review({
    author: authorId,
    user: sellerId,
    listing: listingId,
    rating: Number(rating),
    comment: comment,
  });

  await review.save();

  // 4. Update the seller's average rating
  const seller = await User.findById(sellerId);
  if (seller) {
    // Find all reviews for this seller
    const sellerReviews = await Review.find({ user: sellerId });

    // Calculate new average
    const totalRating = sellerReviews.reduce((acc, item) => item.rating + acc, 0);
    seller.numReviews = sellerReviews.length;
    seller.rating = totalRating / sellerReviews.length;

    await seller.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Seller not found');
  }
});

// @desc    Get all reviews for a user
// @route   GET /api/reviews/:sellerId
// @access  Public
const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.params.sellerId })
    .populate('author', 'name') // Get the reviewer's name
    .sort({ createdAt: -1 });
    
  res.json(reviews);
});

module.exports = {
  createReview,
  getUserReviews,
};