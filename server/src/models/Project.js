const mongoose = require('mongoose');
const { generateProjectKey } = require('../utils/helpers');

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      maxlength: 5
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['lead', 'member', 'viewer'],
          default: 'member'
        },
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    sprints: [
      {
        name: { type: String, required: true },
        goal: { type: String, default: '' },
        startDate: { type: Date },
        endDate: { type: Date },
        status: {
          type: String,
          enum: ['planning', 'active', 'completed'],
          default: 'planning'
        },
        velocity: { type: Number, default: 0 }
      }
    ],
    activeSprint: { type: mongoose.Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ['active', 'on-hold', 'completed', 'archived'],
      default: 'active'
    },
    settings: {
      autoAssignEnabled: { type: Boolean, default: true },
      standupEnabled: { type: Boolean, default: true },
      standupTime: { type: String, default: '10:00' },
      standupDays: {
        type: [String],
        default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      },
      moodCheckInEnabled: { type: Boolean, default: true }
    },
    tags: [String],
    color: { type: String, default: '#6366f1' },
    icon: { type: String, default: '📁' },
    taskCount: { type: Number, default: 0 },
    completedTaskCount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ProjectSchema.virtual('completionPercentage').get(function () {
  if (this.taskCount === 0) return 0;
  return Math.round((this.completedTaskCount / this.taskCount) * 100);
});

ProjectSchema.virtual('memberCount').get(function () {
  return this.members ? this.members.length : 0;
});

ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ 'members.user': 1 });
ProjectSchema.index({ status: 1 });

// Auto generate key before validation
ProjectSchema.pre('validate', async function (next) {
  if (this.isNew && !this.key) {
    let baseKey = generateProjectKey(this.name);
    let key = baseKey;
    let counter = 1;

    // Ensure unique key
    while (await mongoose.model('Project').findOne({ key })) {
      key = `${baseKey}${counter}`;
      counter++;
    }

    this.key = key;
  }
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);