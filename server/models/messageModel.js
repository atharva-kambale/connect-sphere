// server/models/messageModel.js

const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    // This is the unique room ID, e.g., 'BuyerID_SellerID_ListingID'
    // We will use this to find all messages for a specific chat.
    room: {
      type: String,
      required: true,
    },
    // This is the user who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Creates a relationship with our User model
    },
    // This is the actual text of the message
    content: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);