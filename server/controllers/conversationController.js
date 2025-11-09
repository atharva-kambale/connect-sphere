// server/controllers/conversationController.js

const asyncHandler = require('express-async-handler');
const Conversation = require('../models/conversationModel.js');

// @desc    Get all of a user's conversations (their "Inbox")
// @route   GET /api/conversations
// @access  Private
const getMyConversations = asyncHandler(async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: 'participants',
        select: 'name _id',
      })
      .populate({
        path: 'listing', // This is the one that can be null
        select: 'title imageUrl user',
      })
      .populate({
        path: 'lastMessage',
        select: 'content sender createdAt',
      });

    // Format the data to be easy for the frontend
    const formattedConversations = conversations.map((conv) => {
      // --- THIS IS THE FIX ---
      // 1. If the listing was deleted, conv.listing will be null.
      //    We must check for this and skip it.
      if (!conv.listing || !conv.participants || conv.participants.length < 2) {
        return null; // This will be filtered out
      }
      // --- END OF FIX ---

      // 2. Find the other user
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== req.user.id.toString()
      );

      // 3. Identify the Seller and Buyer IDs
      const sellerId = conv.listing.user; // We know conv.listing exists now
      const buyer = conv.participants.find(
        (p) => p._id.toString() !== sellerId.toString()
      );
      
      const buyerId = buyer ? buyer._id : otherUser._id;

      // 4. Create the correct, universal URL
      const chatUrl = `/chat/${conv.listing._id}/${buyerId}/${sellerId}`;

      return {
        _id: conv._id,
        listing: conv.listing,
        lastMessage: conv.lastMessage,
        updatedAt: conv.updatedAt,
        withUser: otherUser || { name: 'Unknown User' },
        chatUrl: chatUrl,
      };
    })
    // 5. Filter out any null conversations
    .filter(conv => conv !== null); 
    
    res.json(formattedConversations);
    
  } catch (error) {
    res.status(500);
    console.error(error);
    throw new Error('Server error fetching conversations');
  }
});

module.exports = {
  getMyConversations,
};