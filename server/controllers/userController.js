// server/controllers/userController.js

const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js'); // 1. Import our token generator

// --- (registerUser function is the same as before) ---
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
      token: generateToken(user._id), // Also send a token on register
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// --- 2. ADD THIS NEW FUNCTION ---
// @desc    Authenticate (log in) a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists AND if the password matches
  if (user && (await bcrypt.compare(password, user.password))) {
    // 3. Send back the user data and the token
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      university: user.university,
      token: generateToken(user._id), // This is the user's "key"
    });
  } else {
    // If password or email is wrong
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// --- ADD THIS NEW FUNCTION ---
// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private (Needs a token)
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user was added by our 'protect' middleware!
  if (req.user) {
    res.json({
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      university: req.user.university,
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
  getUserProfile, // Add the new function
};  