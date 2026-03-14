const express = require('express');
const router = express.Router();
const { 
  registerUser, verifyOtp, loginUser, 
  forgotPassword, resetPassword, 
  sendLoginOtp, verifyLoginOtp,
  getUserProfile, updateUserProfile, getPublicUserProfile 
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Public
router.post('/', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);

// New Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// New OTP Login Routes
router.post('/login-otp-send', sendLoginOtp);
router.post('/login-otp-verify', verifyLoginOtp);

// Private
router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').get(getPublicUserProfile);

module.exports = router;