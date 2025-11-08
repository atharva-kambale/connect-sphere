// server/controllers/listingController.js

const asyncHandler = require('express-async-handler');
const Listing = require('../models/listingModel.js');

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
const createListing = asyncHandler(async (req, res) => {
  // 1. Get imageUrl from the body (it's new!)
  const { title, description, price, category, imageUrl } = req.body;

  if (!title || !description || !price || !category) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  
  // 2. We no longer need the default placeholder, so a real URL is expected
  //    (but we won't make it 100% required, in case of a fallback)
  if (!imageUrl) {
    console.warn('No image URL provided for new listing');
  }

  const listing = await Listing.create({
    title,
    description,
    price,
    category,
    imageUrl, // 3. Save the new imageUrl
    user: req.user.id,
    university: req.user.university,
  });

  res.status(201).json(listing);
});

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({}).sort({ createdAt: -1 });
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

  const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

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

module.exports = {
  createListing,
  getListings,
  updateListing,
  deleteListing,
};