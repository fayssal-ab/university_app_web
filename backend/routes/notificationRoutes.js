const router = require('express').Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// All notification routes require authentication
router.use(protect);

// GET all notifications for current user
// Query params: ?read=true/false, ?type=assignment/grade/announcement, ?limit=50
// Example: GET /api/notifications?read=false&limit=10
router.get('/', getNotifications);

// PATCH mark single notification as read
// Example: PATCH /api/notifications/123abc/read
router.patch('/:id/read', markAsRead);

// PATCH mark all notifications as read for current user
// Example: PATCH /api/notifications/read-all
router.patch('/read-all', markAllAsRead);

// DELETE single notification
// Example: DELETE /api/notifications/123abc
router.delete('/:id', deleteNotification);

module.exports = router;