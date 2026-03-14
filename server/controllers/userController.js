// server/controllers/userController.js

const User = require('../models/userModel.js');
const Otp = require('../models/otpModel.js');
const sendEmail = require('../utils/sendEmail.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// --- HELPERS ---
const cleanEmailInput = (email) => email.trim().toLowerCase();
const generate6DigitOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, university } = req.body;
  if (!name || !email || !password || !university) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const cleanEmail = cleanEmailInput(email);
  const emailDomain = cleanEmail.split('@')[1];
  const allowedDomains = ['edu', 'ac.in', 'sitrc.ac.in', 'gmail.com']; 
  const isValidDomain = emailDomain && allowedDomains.some(domain => cleanEmail.endsWith(domain));

  if (!isValidDomain) {
    res.status(400);
    throw new Error('Access Denied: Use a university email.');
  }

  let user = await User.findOne({ email: cleanEmail });

  if (user) {
    if (user.isVerified) {
      res.status(400);
      throw new Error('User already exists and is verified. Please log in.');
    } else {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.name = name;
      user.university = university;
      await user.save();
    }
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      university,
      isVerified: false,
    });
  }

  const otpCode = generate6DigitOtp();
  await Otp.deleteMany({ email: cleanEmail });
  await Otp.create({ email: cleanEmail, otp: otpCode });

  try {
    await sendEmail({
      email: cleanEmail,
      subject: 'Connect Sphere - Registration OTP',
      message: `Welcome to Connect Sphere! Your registration code is: ${otpCode}`,
    });
  } catch (error) { console.error("Email Error:", error); }

  res.status(201).json({ message: 'Code sent!', email: cleanEmail });
});

// @desc    Verify OTP for Registration
const verifyOtp = asyncHandler(async (req, res) => {
  let { email, otp } = req.body;
  const cleanEmail = cleanEmailInput(email);
  const cleanOtp = otp.toString().trim();

  const validOtp = await Otp.findOne({ email: cleanEmail, otp: cleanOtp });
  if (!validOtp) {
    res.status(400);
    throw new Error('Invalid or expired code.');
  }

  const user = await User.findOne({ email: cleanEmail });
  if (!user) { res.status(400); throw new Error('User not found'); }

  user.isVerified = true;
  await user.save();
  await Otp.deleteMany({ email: cleanEmail });

  res.json({ _id: user.id, name: user.name, email: user.email, university: user.university, token: generateToken(user._id) });
});

// @desc    Traditional Login (Password)
const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  const cleanEmail = cleanEmailInput(email);
  const user = await User.findOne({ email: cleanEmail });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (!user.isVerified) { res.status(401); throw new Error('Please verify your email first.'); }
    res.json({ _id: user.id, name: user.name, email: user.email, university: user.university, token: generateToken(user._id) });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// ==========================================
// --- NEW: FORGOT PASSWORD LOGIC ---
// ==========================================

// @desc    Send OTP for Password Reset
const forgotPassword = asyncHandler(async (req, res) => {
  const cleanEmail = cleanEmailInput(req.body.email);
  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    res.status(404);
    throw new Error('No account found with this email.');
  }

  const otpCode = generate6DigitOtp();
  await Otp.deleteMany({ email: cleanEmail });
  await Otp.create({ email: cleanEmail, otp: otpCode });

  await sendEmail({
    email: cleanEmail,
    subject: 'Connect Sphere - Password Reset',
    message: `Your password reset code is: ${otpCode}. If you did not request this, ignore this email.`,
  });

  res.json({ message: 'Reset code sent to your email.' });
});

// @desc    Verify OTP and Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const cleanEmail = cleanEmailInput(email);

  const validOtp = await Otp.findOne({ email: cleanEmail, otp: otp.trim() });
  if (!validOtp) {
    res.status(400);
    throw new Error('Invalid or expired reset code.');
  }

  const user = await User.findOne({ email: cleanEmail });
  if (!user) { res.status(404); throw new Error('User not found.'); }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.isVerified = true; // Just in case an unverified user resets password
  await user.save();

  await Otp.deleteMany({ email: cleanEmail });

  res.json({ message: 'Password reset successful! You can now log in.' });
});

// ==========================================
// --- NEW: OTP LOGIN LOGIC ---
// ==========================================

// @desc    Send OTP for Direct Login
const sendLoginOtp = asyncHandler(async (req, res) => {
  const cleanEmail = cleanEmailInput(req.body.email);
  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    res.status(404);
    throw new Error('No account found. Please register first.');
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error('Account not verified. Please register again to verify.');
  }

  const otpCode = generate6DigitOtp();
  await Otp.deleteMany({ email: cleanEmail });
  await Otp.create({ email: cleanEmail, otp: otpCode });

  await sendEmail({
    email: cleanEmail,
    subject: 'Connect Sphere - Login Code',
    message: `Your one-time login code is: ${otpCode}`,
  });

  res.json({ message: 'Login code sent!' });
});

// @desc    Verify Login OTP and Log In
const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const cleanEmail = cleanEmailInput(email);

  const validOtp = await Otp.findOne({ email: cleanEmail, otp: otp.trim() });
  if (!validOtp) {
    res.status(400);
    throw new Error('Invalid or expired login code.');
  }

  const user = await User.findOne({ email: cleanEmail });
  await Otp.deleteMany({ email: cleanEmail });

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    university: user.university,
    token: generateToken(user._id),
  });
});

// ... Keep existing getUserProfile, updateUserProfile, getPublicUserProfile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) { res.json({ _id: user.id, name: user.name, email: user.email, university: user.university }); }
  else { res.status(404); throw new Error('User not found'); }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const filteredBody = filterObj(req.body, 'name', 'email', 'university', 'password');
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = filteredBody.name || user.name;
    user.email = (filteredBody.email || user.email).trim().toLowerCase();
    user.university = filteredBody.university || user.university;
    if (filteredBody.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(filteredBody.password, salt);
    }
    const updatedUser = await user.save();
    res.json({ _id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, university: updatedUser.university, token: generateToken(updatedUser._id) });
  } else { res.status(404); throw new Error('User not found'); }
});

const getPublicUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('name university createdAt');
  if (user) { res.json(user); } else { res.status(404); throw new Error('User not found'); }
});

module.exports = { 
  registerUser, verifyOtp, loginUser, 
  forgotPassword, resetPassword, 
  sendLoginOtp, verifyLoginOtp,
  getUserProfile, updateUserProfile, getPublicUserProfile 
};