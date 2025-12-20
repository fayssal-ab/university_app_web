const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['announcement', 'grade', 'assignment', 'submission', 'general', 'system'],
    required: true,
    default: 'general'
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['Assignment', 'Grade', 'Module', 'Submission', null]
    },
    id: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Mark as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = Date.now();
  return this.save();
};

// Populate recipient and sender
notificationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'recipient',
    select: 'firstName lastName email role'
  }).populate({
    path: 'sender',
    select: 'firstName lastName email role'
  });
  next();
});

// Index for faster queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
