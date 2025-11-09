// server/routes/conversationRoutes.js

const express = require('express');
const router = express.Router();
const { getMyConversations } = require('../controllers/conversationController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Define the route
// GET /api/conversations will be protected and then get the inbox
router.route('/').get(protect, getMyConversations);

module.exports = router;