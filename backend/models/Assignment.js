const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    trim: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  maxGrade: {
    type: Number,
    required: true,
    default: 20,
    min: 0
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  instructions: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Check if assignment is overdue
assignmentSchema.virtual('isOverdue').get(function() {
  return new Date() > this.deadline;
});

// Populate module and professor
assignmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'module',
    select: 'code name'
  }).populate({
    path: 'professor',
    populate: {
      path: 'user',
      select: 'firstName lastName'
    }
  });
  next();
});

module.exports = mongoose.model('Assignment', assignmentSchema);
