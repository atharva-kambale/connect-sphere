// server/routes/listingRoutes.js

const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
} = require('../controllers/listingController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Base routes
router.route('/')
  .post(protect, createListing)
  .get(getListings);             

// Specific route MUST be before '/:id'
router.route('/my-listings').get(protect, getMyListings);

// ID routes at the bottom
router.route('/:id')
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

module.exports = router;