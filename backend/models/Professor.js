const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  professorId: {
    type: String,
    required: [true, 'Professor ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  branches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  }],
  assignedModules: [{
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Level'
    },
    academicYear: String
  }],
  phoneNumber: {
    type: String,
    trim: true
  },
  officeLocation: {
    type: String,
    trim: true
  },
  officeHours: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// ✅ NO PRE HOOK - Controllers handle populate manually
module.exports = mongoose.model('Professor', professorSchema);