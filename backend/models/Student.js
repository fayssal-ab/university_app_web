const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    uppercase: true,
    trim: true
    // Ex: "STU2024001"
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },
  field: {
    type: String,
    required: [true, 'Field of study is required'],
    trim: true
    // Ex: "Génie Informatique"
  },
  enrolledModules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
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
  dateOfBirth: {
    type: Date
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Populate user data automatically
module.exports = mongoose.model('Student', studentSchema);


module.exports = mongoose.model('Student', studentSchema);
