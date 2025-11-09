// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile, // 1. Import new function
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// --- 2. UPDATE THIS ROUTE ---
// Chain GET and PUT requests to the same '/me' path
router
  .route('/me')
  .get(protect, getUserProfile) // GET /api/users/me
  .put(protect, updateUserProfile); // PUT /api/users/me

module.exports = router;