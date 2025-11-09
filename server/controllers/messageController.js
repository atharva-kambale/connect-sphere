// server/controllers/messageController.js

const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel.js');

// @desc    Get all messages for a specific room
// @route   GET /api/messages/:room
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  try {
    // Find all messages that match the room name
    const messages = await Message.find({ room: req.params.room })
      // --- THIS IS THE UPGRADE ---
      // Populate the 'sender' field with their _id and name
      .populate('sender', 'name _id')
      // --- END OF UPGRADE ---
      .sort({ createdAt: 'asc' }); // Sort by oldest first
    
    res.json(messages);
  } catch (error) {
    res.status(500);
    throw new Error('Server error fetching messages');
  }
});

module.exports = {
  getMessages,
};