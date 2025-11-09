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
        select: 'name _id', // Get the name and ID of both users
      })
      .populate({
        path: 'listing',
        select: 'title imageUrl user', // Need 'user' to find the seller
      })
      .populate({
        path: 'lastMessage',
        select: 'content sender createdAt',
      });

    // Format the data to be easy for the frontend
    const formattedConversations = conversations.map((conv) => {
      // --- THIS IS THE NEW, CORRECT LOGIC ---
      
      // 1. Find the other user
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== req.user.id.toString()
      );

      // 2. Identify the Seller and Buyer IDs
      // The listing's 'user' field is the Seller
      const sellerId = conv.listing.user;
      
      // The 'otherUser' *might* be the seller.
      // The logged-in user (req.user.id) *might* be the seller.
      // The Buyer is the participant who is NOT the seller.
      const buyer = conv.participants.find(
        (p) => p._id.toString() !== sellerId.toString()
      );
      
      // This is a failsafe in case buyer is null
      const buyerId = buyer ? buyer._id : otherUser._id; 

      // 3. Create the 100% correct, universal URL
      const chatUrl = `/chat/${conv.listing._id}/${buyerId}/${sellerId}`;
      // --- END OF FIX ---

      return {
        _id: conv._id,
        listing: conv.listing,
        lastMessage: conv.lastMessage,
        updatedAt: conv.updatedAt,
        withUser: otherUser || { name: 'Unknown User' },
        chatUrl: chatUrl, // This link will now work
      };
    });
    
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