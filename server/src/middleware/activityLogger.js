const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

/**
 * Log user activity (non-blocking)
 */
const logActivity = async ({ userId, projectId, taskId, action, details }) => {
  try {
    await ActivityLog.create({
      user: userId,
      project: projectId || null,
      task: taskId || null,
      action,
      details: details || {},
      timestamp: new Date()
    });
  } catch (error) {
    logger.error(`Activity log error: ${error.message}`);
  }
};

module.exports = { logActivity };