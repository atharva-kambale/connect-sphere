// server/controllers/listingController.js

const asyncHandler = require('express-async-handler');
const Listing = require('../models/listingModel.js');

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
const createListing = asyncHandler(async (req, res) => {
  const { title, description, price, category, imageUrls } = req.body;

  if (!title || !description || !price || !category) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  if (!imageUrls || imageUrls.length === 0) {
    res.status(400);
    throw new Error('Please add at least one image');
  }

  const listing = await Listing.create({
    title,
    description,
    price,
    category,
    imageUrls,
    user: req.user.id,
    university: req.user.university,
  });

  res.status(201).json(listing);
});

// @desc    Get all listings (or search/filter)
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
  // --- THIS IS THE UPGRADE ---
  
  // 1. Build the keyword filter
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
    
  // 2. Build the category filter
  const category = req.query.category
    ? {
        category: req.query.category, // Exact match on category
      }
    : {};
  
  // 3. Combine all filters
  // This finds listings that match BOTH the keyword AND the category
  const listings = await Listing.find({ ...keyword, ...category }).sort({ createdAt: -1 });
  // --- END OF UPGRADE ---
  
  res.json(listings);
});

// @desc    Get a single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (listing) {
    res.json(listing);
  } else {
    res.status(404);
    throw new Error('Listing not found');
  }
});

// @desc    Get listings for the logged-in user
// @route   GET /api/listings/my-listings
// @access  Private
const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  
  res.json(listings);
});

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  if (listing.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this listing');
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.json(updatedListing);
});

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  if (listing.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to delete this listing');
  }

  await Listing.findByIdAndDelete(req.params.id);

  res.json({ id: req.params.id, message: 'Listing removed' });
});

// Export all functions
module.exports = {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
};