const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    type: {
      type: String,
      enum: ['text', 'system', 'file'],
      default: 'text'
    },
    fileUrl: { type: String },
    fileName: { type: String },
    isEdited: { type: Boolean, default: false },
    readBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

ChatMessageSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);