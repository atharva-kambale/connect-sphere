// server/controllers/notificationController.js

const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel.js');

// @desc    Get all of a user's unread notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  // Find all notifications for the logged-in user that are 'read: false'
  const notifications = await Notification.find({
    user: req.user._id,
    read: false,
  })
  .sort({ createdAt: -1 }); // Newest first
    
  res.json(notifications);
});

// @desc    Mark notifications as read
// @route   PUT /api/notifications/mark-read
// @access  Private
const markNotificationsAsRead = asyncHandler(async (req, res) => {
  // Find all unread notifications for the logged-in user and update them
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { $set: { read: true } }
  );
    
  res.status(200).json({ message: 'Notifications marked as read' });
});

module.exports = {
  getMyNotifications,
  markNotificationsAsRead,
};