const ChatMessage = require('../models/ChatMessage');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination } = require('../utils/pagination');
const { emitToProject } = require('../config/socket');
const logger = require('../utils/logger');

// ═══ GET MESSAGES ═══
exports.getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { page, limit, skip } = parsePagination(req.query);

    const total = await ChatMessage.countDocuments({ project: projectId });
    const messages = await ChatMessage.find({ project: projectId })
      .populate('sender', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Return in chronological order
    messages.reverse();

    return ApiResponse.paginated(res, messages, page, limit, total);
  } catch (error) {
    logger.error(`Get messages error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ SEND MESSAGE ═══
exports.sendMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return ApiResponse.badRequest(res, 'Message text is required');
    }

    const message = await ChatMessage.create({
      project: projectId,
      sender: req.user._id,
      text: text.trim(),
      type: 'text'
    });

    await message.populate('sender', 'firstName lastName avatar');

    // Real-time broadcast
    emitToProject(projectId, 'new-message', message);

    return ApiResponse.created(res, message, 'Message sent');
  } catch (error) {
    logger.error(`Send message error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ DELETE MESSAGE ═══
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);
    if (!message) return ApiResponse.notFound(res, 'Message not found');

    if (message.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, 'You can only delete your own messages');
    }

    await ChatMessage.findByIdAndDelete(req.params.id);

    emitToProject(message.project.toString(), 'message-deleted', {
      messageId: req.params.id
    });

    return ApiResponse.success(res, null, 'Message deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};