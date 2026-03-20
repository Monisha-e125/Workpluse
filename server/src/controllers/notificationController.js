const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination } = require('../utils/pagination');
const { emitToUser } = require('../config/socket');
const logger = require('../utils/logger');

// ═══ GET NOTIFICATIONS ═══
exports.getNotifications = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { recipient: req.user._id };

    if (req.query.unreadOnly === 'true') filter.isRead = false;

    const total = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .populate('sender', 'firstName lastName avatar')
      .populate('project', 'name key icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET UNREAD COUNT ═══
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });
    return ApiResponse.success(res, { count });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ MARK AS READ ═══
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) return ApiResponse.notFound(res, 'Notification not found');

    return ApiResponse.success(res, notification, 'Marked as read');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ MARK ALL AS READ ═══
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return ApiResponse.success(res, null, 'All notifications marked as read');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ DELETE NOTIFICATION ═══
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });
    return ApiResponse.success(res, null, 'Notification deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ CLEAR ALL ═══
exports.clearAll = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    return ApiResponse.success(res, null, 'All notifications cleared');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ CREATE NOTIFICATION (utility — used internally) ═══
exports.createNotification = async ({
  recipientId, senderId, type, title, message, link, projectId, taskId
}) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId || null,
      type,
      title,
      message,
      link: link || '',
      project: projectId || null,
      task: taskId || null
    });

    await notification.populate('sender', 'firstName lastName avatar');
    await notification.populate('project', 'name key icon');

    // Real-time push
    emitToUser(recipientId.toString(), 'notification', notification);

    return notification;
  } catch (error) {
    logger.error(`Create notification error: ${error.message}`);
  }
};