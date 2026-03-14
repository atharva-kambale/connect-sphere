// server/models/notificationModel.js

const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    // The user this notification is FOR
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The user who *sent* the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    // The conversation this is about
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    // The URL the notification should link to
    linkUrl: {
      type: String,
      required: true,
    },
    // The message content
    message: {
      type: String,
      required: true,
    },
    // Has the user seen this notification?
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);