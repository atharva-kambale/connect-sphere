// server/routes/listingRoutes.js

const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  updateListing, // NEW
  deleteListing, // NEW
} = require('../controllers/listingController.js');
const { protect } = require('../middleware/authMiddleware.js');

// This chains all requests for the base '/' route
router.route('/')
  .post(protect, createListing) // POST /api/listings
  .get(getListings);             // GET /api/listings

// This chains all requests for a specific ID '/:id'
router.route('/:id')
  .put(protect, updateListing)    // PUT /api/listings/123
  .delete(protect, deleteListing); // DELETE /api/listings/123

module.exports = router;