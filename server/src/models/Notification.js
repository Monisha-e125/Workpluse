const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      required: true,
      enum: [
        'task-assigned', 'task-updated', 'task-completed',
        'comment-added', 'mention', 'sprint-started',
        'burnout-alert', 'mood-reminder', 'standup-ready',
        'project-invite', 'overdue-task', 'ai-suggestion',
        'chat-message', 'member-added', 'member-removed'
      ]
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date }
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);