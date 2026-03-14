// server/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markNotificationsAsRead,
} = require('../controllers/notificationController.js');
const { protect } = require('../middleware/authMiddleware.js');

// GET /api/notifications
router.route('/').get(protect, getMyNotifications);

// PUT /api/notifications/mark-read
router.route('/mark-read').put(protect, markNotificationsAsRead);

module.exports = router;