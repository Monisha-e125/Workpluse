const mongoose = require('mongoose');

const MoodCheckInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    mood: {
      type: Number,
      min: 1,
      max: 5,
      required: true
      // 1=😫 2=😟 3=😐 4=😊 5=😄
    },
    factors: [
      {
        type: String,
        enum: [
          'workload',
          'team-dynamics',
          'personal',
          'unclear-requirements',
          'technical-debt',
          'recognition',
          'growth',
          'work-life-balance',
          'tooling-issues',
          'deadline-pressure'
        ]
      }
    ],
    note: {
      type: String,
      maxlength: 500,
      default: ''
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

MoodCheckInSchema.index({ user: 1, date: -1 });
MoodCheckInSchema.index({ project: 1, date: -1 });

module.exports = mongoose.model('MoodCheckIn', MoodCheckInSchema);