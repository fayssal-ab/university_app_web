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
    // Ex: "PROF2024001"
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
    // Ex: "Département Informatique"
  },
  specialization: {
    type: String,
    trim: true
    // Ex: "Intelligence Artificielle"
  },
  assignedModules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  phoneNumber: {
    type: String,
    trim: true
  },
  officeLocation: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Populate user data automatically
professorSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email profilePicture'
  });
  next();
});

module.exports = mongoose.model('Professor', professorSchema);
