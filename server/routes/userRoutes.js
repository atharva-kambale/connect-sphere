// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPublicUserProfile, 
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Private "me" route
router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Public profile route MUST be last
router.route('/:id').get(getPublicUserProfile); 

module.exports = router;