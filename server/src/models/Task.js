const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: ''
    },
    taskId: {
      type: String,
      unique: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    sprint: { type: mongoose.Schema.Types.ObjectId },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignmentMethod: {
      type: String,
      enum: ['manual', 'ai-auto', 'ai-suggested'],
      default: 'manual'
    },
    status: {
      type: String,
      enum: ['backlog', 'todo', 'in-progress', 'in-review', 'testing', 'done'],
      default: 'backlog'
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium'
    },
    type: {
      type: String,
      enum: ['feature', 'bug', 'improvement', 'task', 'epic'],
      default: 'task'
    },
    complexity: { type: Number, min: 1, max: 10, default: 3 },
    storyPoints: {
      type: Number,
      enum: [1, 2, 3, 5, 8, 13, 21],
      default: 3
    },
    requiredSkills: [
      {
        name: String,
        weight: { type: Number, min: 0, max: 1, default: 0.5 }
      }
    ],
    estimatedHours: { type: Number },
    actualHours: { type: Number, default: 0 },
    dueDate: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    labels: [String],
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileSize: Number,
        fileType: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        sentiment: {
          type: String,
          enum: ['positive', 'neutral', 'negative']
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date }
      }
    ],
    statusHistory: [
      {
        from: String,
        to: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
        timeInStatus: Number
      }
    ],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String },
    order: { type: Number, default: 0 },
    aiPrioritySuggestion: {
      suggestedPriority: String,
      confidence: Number,
      reasoning: String
    },
    aiAssignmentSuggestion: {
      suggestedAssignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      matchScore: Number,
      reasoning: String
    }
  },
  { timestamps: true }
);

// Auto-generate taskId
TaskSchema.pre('save', async function (next) {
  if (!this.taskId) {
    const project = await mongoose.model('Project').findById(this.project);
    const count = await mongoose.model('Task').countDocuments({
      project: this.project
    });
    this.taskId = `${project ? project.key : 'TSK'}-${count + 1}`;
  }

  // Track status changes
  if (this.isModified('status') && !this.isNew) {
    if (this.status === 'in-progress' && !this.startedAt) {
      this.startedAt = new Date();
    }
    if (this.status === 'done' && !this.completedAt) {
      this.completedAt = new Date();
    }
    if (this.status !== 'done') {
      this.completedAt = null;
    }
  }

  next();
});

TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ assignee: 1, status: 1 });
TaskSchema.index({ project: 1, sprint: 1 });
TaskSchema.index({ taskId: 1 });

module.exports = mongoose.model('Task', TaskSchema);