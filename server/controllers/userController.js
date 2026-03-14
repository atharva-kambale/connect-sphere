// server/controllers/userController.js

const User = require('../models/userModel.js');
const Otp = require('../models/otpModel.js'); // <-- NEW IMPORT
const sendEmail = require('../utils/sendEmail.js'); // <-- NEW IMPORT
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

  // --- STUDENT EMAIL FILTER ---
  const emailDomain = email.split('@')[1]?.toLowerCase();
  const allowedDomains = ['edu', 'ac.in', 'sitrc.ac.in', 'gmail.com']; // VIP List
  const isValidDomain = emailDomain && allowedDomains.some(domain => emailDomain.endsWith(domain));

  if (!isValidDomain) {
    res.status(400);
    throw new Error('Access Denied: Please use a valid university email to register for Connect Sphere.');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 1. Create the user (they are isVerified: false by default!)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    university,
  });

  if (user) {
    // 2. Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save OTP to database
    await Otp.create({
      email: user.email,
      otp: otpCode,
    });

    // 4. Send the Email
    const message = `Hello ${user.name},\n\nWelcome to Connect Sphere! Your email verification code is:\n\n${otpCode}\n\nThis code will expire in 10 minutes.\n\nThank you,\nConnect Sphere Team`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Connect Sphere - Email Verification Code',
        message: message,
      });
    } catch (error) {
      console.error("Email Sending Error:", error);
      // Even if email fails, we don't want to crash the whole app, but we should log it.
    }

    // 5. Tell the frontend to send the user to the OTP screen
    res.status(201).json({
      message: 'User registered successfully. Please check your email for the OTP.',
      email: user.email 
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
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

  // 1. Check if OTP exists and matches
  const validOtp = await Otp.findOne({ email, otp });

  if (!validOtp) {
    res.status(400);
    throw new Error('Invalid or expired OTP code');
  }

  // 2. Find the user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  // 3. Mark user as verified and save
  user.isVerified = true;
  await user.save();

  // 4. Delete the OTP from the database so it can't be used again
  await Otp.deleteOne({ _id: validOtp._id });

  // 5. Send back the exact same payload as a successful login!
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
    
    // --- NEW SECURITY CHECK ---
    if (!user.isVerified) {
      res.status(401);
      throw new Error('Please verify your email address before logging in. If you did not receive a code, please register again.');
    }
    // --------------------------

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
  verifyOtp, // <-- EXPORT NEW FUNCTION
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPublicUserProfile, 
};