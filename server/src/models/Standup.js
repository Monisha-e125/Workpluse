const mongoose = require('mongoose');

const StandupSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    date: { type: Date, required: true },
    generationType: {
      type: String,
      enum: ['auto-generated', 'manual', 'hybrid'],
      default: 'auto-generated'
    },
    entries: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        yesterday: [
          {
            task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
            description: String,
            autoDetected: { type: Boolean, default: true }
          }
        ],
        today: [
          {
            task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
            description: String
          }
        ],
        blockers: [
          {
            description: String,
            severity: {
              type: String,
              enum: ['low', 'medium', 'high'],
              default: 'medium'
            }
          }
        ]
      }
    ],
    aiInsights: {
      sprintHealth: { type: Number, default: 0 },
      atRiskItems: [String],
      velocityComparison: String,
      recommendations: [String]
    }
  },
  { timestamps: true }
);

StandupSchema.index({ project: 1, date: -1 });

module.exports = mongoose.model('Standup', StandupSchema);