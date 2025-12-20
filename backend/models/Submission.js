const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  fileUrl: {
    type: String,
    required: [true, 'Submission file is required']
  },
  fileName: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: Number,
    min: 0,
    default: null
  },
  feedback: {
    type: String,
    trim: true,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'graded', 'late'],
    default: 'pending'
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor'
  },
  gradedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Check if submission is late
submissionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const assignment = await mongoose.model('Assignment').findById(this.assignment);
    if (assignment && this.submittedAt > assignment.deadline) {
      this.status = 'late';
    }
  }
  next();
});

// Populate assignment and student
submissionSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'assignment',
    select: 'title deadline maxGrade module',
    populate: {
      path: 'module',
      select: 'code name'
    }
  }).populate({
    path: 'student',
    populate: {
      path: 'user',
      select: 'firstName lastName email'
    }
  });
  next();
});

// Prevent duplicate submissions
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
