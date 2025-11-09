// server/models/conversationModel.js

const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema(
  {
    // Array of users in this chat (will be 2: buyer and seller)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // The listing this chat is about
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    // The most recent message sent in this chat
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt'
    timestamps: true,
  }
);

module.exports = mongoose.model('Conversation', conversationSchema);