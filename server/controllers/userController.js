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
  // We sanitize the input here too
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
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      university: req.user.university,
      rating: req.user.rating, // Ensure these are included
      numReviews: req.user.numReviews,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // 1. --- CRITICAL SECURITY FIX ---
  // We use the filterObj helper to ensure a user can ONLY update these fields.
  // This prevents malicious users from updating sensitive fields like 'isAdmin' or 'role'.
  const filteredBody = filterObj(req.body, 'name', 'email', 'university', 'password');
  // --- END FIX ---
  
  const user = await User.findById(req.user._id);

  if (user) {
    // 2. Update the fields using the sanitized data
    user.name = filteredBody.name || user.name;
    user.email = filteredBody.email || user.email;
    user.university = filteredBody.university || user.university;

    // 3. (Optional) Update password if it was sent
    if (filteredBody.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(filteredBody.password, salt);
    }

    // 4. Save the updated user
    const updatedUser = await user.save();

    // 5. Send back new user data with a new token
    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      university: updatedUser.university,
      rating: updatedUser.rating,
      numReviews: updatedUser.numReviews,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// --- UPDATE THE EXPORTS ---
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};