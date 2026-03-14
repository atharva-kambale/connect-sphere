// server/controllers/userController.js

const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');

// Helper function to filter unwanted fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, university } = req.body;

  if (!name || !email || !password || !university) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    university,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      university: user.university,
      profilePictureUrl: user.profilePictureUrl,
      bannerImageUrl: user.bannerImageUrl,
      rating: user.rating,
      numReviews: user.numReviews,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate (log in) a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      university: user.university,
      profilePictureUrl: user.profilePictureUrl,
      bannerImageUrl: user.bannerImageUrl,
      rating: user.rating,
      numReviews: user.numReviews,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user profile (for editing)
// @route   GET /api/users/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by our 'protect' middleware
  // We find it again to ensure we have the freshest data
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      university: user.university,
      profilePictureUrl: user.profilePictureUrl,
      bannerImageUrl: user.bannerImageUrl,
      rating: user.rating,
      numReviews: user.numReviews,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile (the "Settings" page)
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // 1. --- THIS IS THE UPGRADE ---
  // Add our new image fields to the list of allowed updates
  const filteredBody = filterObj(
    req.body, 
    'name', 
    'email', 
    'university', 
    'password', 
    'profilePictureUrl', 
    'bannerImageUrl'
  );
  // --- END OF UPGRADE ---
  
  const user = await User.findById(req.user._id);

  if (user) {
    // 2. Update the fields
    user.name = filteredBody.name || user.name;
    user.email = filteredBody.email || user.email;
    user.university = filteredBody.university || user.university;
    user.profilePictureUrl = filteredBody.profilePictureUrl || user.profilePictureUrl;
    user.bannerImageUrl = filteredBody.bannerImageUrl || user.bannerImageUrl;

    if (filteredBody.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(filteredBody.password, salt);
    }

    const updatedUser = await user.save();

    // 5. Send back all user data (including new images)
    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      university: updatedUser.university,
      profilePictureUrl: updatedUser.profilePictureUrl,
      bannerImageUrl: updatedUser.bannerImageUrl,
      rating: updatedUser.rating,
      numReviews: updatedUser.numReviews,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// --- 3. THIS IS THE NEW FUNCTION ---
// @desc    Get a user's public profile
// @route   GET /api/users/:id
// @access  Public
const getPublicUserProfile = asyncHandler(async (req, res) => {
  // Find user by ID, but only select the "safe" public fields
  const user = await User.findById(req.params.id).select(
    'name university createdAt profilePictureUrl bannerImageUrl rating numReviews'
  );

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
// --- END OF NEW FUNCTION ---

// --- UPDATE THE EXPORTS ---
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPublicUserProfile, // Add the new function
};