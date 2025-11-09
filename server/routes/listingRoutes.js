// server/routes/listingRoutes.js

const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListingById,
  getMyListings, // 1. Import new function
  updateListing,
  deleteListing,
} = require('../controllers/listingController.js');
const { protect } = require('../middleware/authMiddleware.js');

// This chains all requests for the base '/' route
router.route('/')
  .post(protect, createListing) // POST /api/listings
  .get(getListings);             // GET /api/listings

// --- 2. ADD THE NEW ROUTE ---
// This MUST be before the '/:id' route
router.route('/my-listings').get(protect, getMyListings);
// --- END OF NEW ROUTE ---

// This chains all requests for a specific ID '/:id'
router.route('/:id')
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

module.exports = router;