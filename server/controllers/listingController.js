// server/controllers/listingController.js

const asyncHandler = require('express-async-handler');
const Listing = require('../models/listingModel.js');

// Helper function MUST be defined before it is used
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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
    title, description, price, category, imageUrls,
    user: req.user.id,
    university: req.user.university,
  });
  res.status(201).json(listing);
});

// @desc    Get all listings (or search/filter)
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.keyword) {
    filter.title = {
      $regex: req.query.keyword,
      $options: 'i',
    };
  }
    
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  if (req.query.user) {
    filter.user = req.query.user;
  }
  
  const listings = await Listing.find(filter).sort({ createdAt: -1 });
  res.json(listings);
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
// server/controllers/listingController.js -> update getListingById function

const getListingById = asyncHandler(async (req, res) => {
  try {
    // Populate explicitly pulls the user data for the frontend to show seller's name/rating
    const listing = await Listing.findById(req.params.id).populate('user', 'name email rating numReviews');
    
    if (listing) {
      res.json(listing);
    } else {
      // If the ID is valid format but listing doesn't exist, return a clean 404
      res.status(404).json({ message: 'Listing not found in database' });
    }
  } catch (error) {
    // This catches MongoDB CastErrors (invalid ID format) and prevents server crash
    console.error("Error fetching listing:", error.message);
    res.status(404).json({ message: 'Invalid Listing ID or Listing Removed' });
  }
});

// @desc    Get logged in user listings
// @route   GET /api/listings/my-listings
// @access  Private
const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(listings);
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) { res.status(404); throw new Error('Listing not found'); }
  if (listing.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
  
  const filteredBody = filterObj(req.body, 'title', 'description', 'price', 'category', 'imageUrls', 'isSold');
  const updatedListing = await Listing.findByIdAndUpdate(req.params.id, filteredBody, { new: true, runValidators: true });
  res.json(updatedListing);
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) { res.status(404); throw new Error('Listing not found'); }
  if (listing.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
  
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ id: req.params.id, message: 'Listing removed' });
});

module.exports = {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
};