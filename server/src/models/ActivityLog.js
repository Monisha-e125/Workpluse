const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    action: {
      type: String,
      required: true,
      enum: [
        'task-created', 'task-updated', 'task-completed', 'task-assigned',
        'task-status-changed', 'comment-added', 'file-uploaded',
        'sprint-started', 'sprint-completed', 'project-created',
        'member-added', 'member-removed', 'login', 'mood-checkin'
      ]
    },
    details: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ActivityLogSchema.index({ user: 1, timestamp: -1 });
ActivityLogSchema.index({ project: 1, timestamp: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);