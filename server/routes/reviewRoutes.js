// server/routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const { createReview, getUserReviews } = require('../controllers/reviewController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Define the routes
// We use a dynamic parameter ':sellerId'
router.route('/:sellerId')
  .post(protect, createReview) // POST /api/reviews/<seller_id>
  .get(getUserReviews);        // GET /api/reviews/<seller_id>

module.exports = router;