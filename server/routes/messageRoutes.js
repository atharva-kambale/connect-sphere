// server/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Define the route
// We use a dynamic parameter ':room' to get the room name
router.route('/:room').get(protect, getMessages);

module.exports = router;