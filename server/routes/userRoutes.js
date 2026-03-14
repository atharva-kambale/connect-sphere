// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPublicUserProfile, // 1. Import new function
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Private "me" route for settings
router
  .route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// --- 2. ADD THE NEW PUBLIC ROUTE ---
// This MUST be last, so '/me' is checked first.
router.route('/:id').get(getPublicUserProfile); // GET /api/users/<user_id>

module.exports = router;