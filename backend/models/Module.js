const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'ppt', 'doc', 'video', 'other'],
    default: 'pdf'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const moduleSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Module code is required'],
    unique: true,
    uppercase: true,
    trim: true
    // Ex: "INF101"
  },
  name: {
    type: String,
    required: [true, 'Module name is required'],
    trim: true
    // Ex: "Programmation C"
  },
  description: {
    type: String,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },
  field: {
    type: String,
    required: true,
    trim: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor'
  },
  coefficient: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 1
  },
  materials: [materialSchema],
  academicYear: {
    type: String,
    required: true
    // Ex: "2024-2025"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Module', moduleSchema);
