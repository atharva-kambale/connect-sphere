// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile, // 1. Import
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js'); // 2. Import the bouncer

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Private route
// 3. Add the 'protect' middleware as the second argument
// This tells Express to run 'protect' *before* 'getUserProfile'
router.get('/me', protect, getUserProfile);

module.exports = router;