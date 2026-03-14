// server/controllers/userController.js

const User = require('../models/userModel.js');
const Otp = require('../models/otpModel.js');
const sendEmail = require('../utils/sendEmail.js');
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

  // 1. --- STUDENT EMAIL FILTER ---
  const emailDomain = email.split('@')[1]?.toLowerCase();
  const allowedDomains = ['edu', 'ac.in', 'sitrc.ac.in', 'gmail.com']; // VIP List (gmail included for testing)
  const isValidDomain = emailDomain && allowedDomains.some(domain => emailDomain.endsWith(domain));

  if (!isValidDomain) {
    res.status(400);
    throw new Error('Access Denied: Please use a valid university email to register.');
  }

  // 2. --- SMART USER CHECK (Handling Unverified Users) ---
  let user = await User.findOne({ email });

  if (user) {
    if (user.isVerified) {
      res.status(400);
      throw new Error('User already exists and is verified. Please log in.');
    } else {
      // Update details for unverified account in case they changed password/name
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.name = name;
      user.university = university;
      await user.save();
    }
  } else {
    // Create brand new unverified user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      university,
      isVerified: false,
    });
  }

  // 3. --- OTP GENERATION & STORAGE ---
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Clear any existing OTPs for this email to avoid confusion
  await Otp.deleteMany({ email: user.email });

  await Otp.create({
    email: user.email,
    otp: otpCode,
  });

  // 4. --- SEND EMAIL VIA RESEND API ---
  const message = `Hello ${user.name},\n\nWelcome to Connect Sphere! Your email verification code is:\n\n${otpCode}\n\nThis code will expire in 10 minutes.\n\nThank you,\nConnect Sphere Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Connect Sphere - Email Verification Code',
      message: message,
    });
  } catch (error) {
    console.error("Email Sending Error:", error);
    // Note: We don't throw an error here so the user can still get to the OTP page
    // if you are using the log-backdoor, but since we are using Resend, this should work.
  }

  // 5. --- RESPONSE ---
  res.status(201).json({
    message: 'Verification code sent! Please check your email.',
    email: user.email 
  });
});

// @desc    Verify OTP and Log in
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error('Please provide email and OTP');
  }

  const validOtp = await Otp.findOne({ email, otp });

  if (!validOtp) {
    res.status(400);
    throw new Error('Invalid or expired OTP code');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  user.isVerified = true;
  await user.save();

  // Remove used OTP
  await Otp.deleteOne({ _id: validOtp._id });

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
});

// @desc    Authenticate (log in) a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    
    if (!user.isVerified) {
      res.status(401);
      throw new Error('Please verify your email address before logging in.');
    }

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

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
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

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const filteredBody = filterObj(req.body, 'name', 'email', 'university', 'password', 'profilePictureUrl', 'bannerImageUrl');
  const user = await User.findById(req.user._id);

  if (user) {
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

// @desc    Get a user's public profile
// @route   GET /api/users/:id
// @access  Public
const getPublicUserProfile = asyncHandler(async (req, res) => {
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

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPublicUserProfile, 
};