const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications, getUnreadCount, markAsRead,
  markAllAsRead, deleteNotification, clearAll
} = require('../controllers/notificationController');

router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/clear-all', clearAll);
router.delete('/:id', deleteNotification);

module.exports = router;