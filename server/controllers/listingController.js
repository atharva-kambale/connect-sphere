// server/controllers/listingController.js

const asyncHandler = require('express-async-handler');
const Listing = require('../models/listingModel.js');

// ... (createListing function is the same)
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
  // --- 1. THIS IS THE UPGRADE ---
  // Build a 'filter' object
  const filter = {};

  // Add keyword filter
  if (req.query.keyword) {
    filter.title = {
      $regex: req.query.keyword,
      $options: 'i',
    };
  }
    
  // Add category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  // Add USER filter (for the public profile)
  if (req.query.user) {
    filter.user = req.query.user;
  }
  
  // 3. Find using the combined filter object
  const listings = await Listing.find(filter).sort({ createdAt: -1 });
  // --- END OF UPGRADE ---
  
  res.json(listings);
});

// ... (getListingById, updateListing, deleteListing functions are the same)
const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('user', 'name email rating numReviews');
  if (listing) { res.json(listing); } else { res.status(404); throw new Error('Listing not found'); }
});

const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(listings);
});

const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) { res.status(404); throw new Error('Listing not found'); }
  if (listing.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
  const filteredBody = filterObj(req.body, 'title', 'description', 'price', 'category', 'imageUrls', 'isSold');
  const updatedListing = await Listing.findByIdAndUpdate(req.params.id, filteredBody, { new: true, runValidators: true });
  res.json(updatedListing);
});

const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) { res.status(404); throw new Error('Listing not found'); }
  if (listing.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ id: req.params.id, message: 'Listing removed' });
});

// Helper function (must be at the bottom or top level)
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// --- UPDATE THE EXPORTS ---
module.exports = {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
};