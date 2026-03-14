// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyOtp,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPublicUserProfile, 
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

// 1. Authentication / Registration
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp); // Static route before dynamic

// 2. Private Profile (Self)
router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// 3. Public Profiles
router.route('/:id').get(getPublicUserProfile); 

module.exports = router;