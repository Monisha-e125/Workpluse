const { createNotification } = require('../controllers/notificationController');

class NotificationService {
  /**
   * Notify when a task is assigned to a user
   */
  static async taskAssigned({ task, assigneeId, assignedBy }) {
    return createNotification({
      recipientId: assigneeId,
      senderId: assignedBy._id,
      type: 'task-assigned',
      title: 'Task Assigned',
      message: `You were assigned: ${task.taskId} - ${task.title}`,
      link: `/projects/${task.project}/board?task=${task._id}`,
      projectId: task.project,
      taskId: task._id
    });
  }

  /**
   * Notify when a task is completed (moves to 'done' status)
   */
  static async taskCompleted({ task, completedBy, notifyUserId }) {
    return createNotification({
      recipientId: notifyUserId,
      senderId: completedBy._id,
      type: 'task-completed',
      title: 'Task Completed',
      message: `${task.taskId} was marked as done by ${completedBy.firstName || 'someone'}.`,
      link: `/projects/${task.project}/board?task=${task._id}`,
      projectId: task.project,
      taskId: task._id
    });
  }

  /**
   * Notify when a task status changes
   */
  static async taskStatusChanged({ task, changedBy, previousStatus, newStatus, notifyUserId }) {
    return createNotification({
      recipientId: notifyUserId,
      senderId: changedBy._id,
      type: 'task-updated',
      title: 'Task Status Updated',
      message: `${task.taskId} moved from ${previousStatus} to ${newStatus}.`,
      link: `/projects/${task.project}/board?task=${task._id}`,
      projectId: task.project,
      taskId: task._id
    });
  }

  /**
   * Notify when a user is added to a project
   */
  static async memberAdded({ project, addedUserId, addedBy }) {
    return createNotification({
      recipientId: addedUserId,
      senderId: addedBy._id,
      type: 'member-added',
      title: 'Added to Project',
      message: `You were added to the project: ${project.name}`,
      link: `/projects/${project._id}`,
      projectId: project._id
    });
  }

  /**
   * Notify when a user is removed from a project
   */
  static async memberRemoved({ project, removedUserId, removedBy }) {
    return createNotification({
      recipientId: removedUserId,
      senderId: removedBy._id,
      type: 'member-removed',
      title: 'Removed from Project',
      message: `You were removed from the project: ${project.name}`,
      link: `/projects`,
      projectId: project._id
    });
  }

  /**
   * Notify when a comment is added to a task
   */
  static async commentAdded({ task, commentBy, commentText, notifyUserId }) {
    return createNotification({
      recipientId: notifyUserId,
      senderId: commentBy._id,
      type: 'comment-added',
      title: 'New Comment',
      message: `${commentBy.firstName || 'Someone'} commented: "${commentText.substring(0, 50)}${commentText.length > 50 ? '...' : ''}"`,
      link: `/projects/${task.project}/board?task=${task._id}`,
      projectId: task.project,
      taskId: task._id
    });
  }
}

module.exports = NotificationService;