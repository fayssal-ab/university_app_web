const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  value: {
    type: Number,
    required: [true, 'Grade value is required'],
    min: [0, 'Grade cannot be negative'],
    max: [20, 'Grade cannot exceed 20']
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  academicYear: {
    type: String,
    required: true
    // Ex: "2024-2025"
  },
  gradeType: {
    type: String,
    enum: ['exam', 'continuous', 'final'],
    default: 'final'
  },
  validated: {
    type: Boolean,
    default: false
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  validatedAt: {
    type: Date
  },
  publishedAt: {
    type: Date
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  comments: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Populate student and module
gradeSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'student',
    populate: {
      path: 'user',
      select: 'firstName lastName email'
    }
  }).populate({
    path: 'module',
    select: 'code name coefficient'
  });
  next();
});

// Prevent duplicate grades for same student/module/semester
gradeSchema.index({ student: 1, module: 1, semester: 1, academicYear: 1, gradeType: 1 }, { unique: true });

module.exports = mongoose.model('Grade', gradeSchema);
