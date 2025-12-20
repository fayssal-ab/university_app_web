const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Level name is required'],
    unique: true,
    trim: true
    // Ex: "Licence 1", "Master 2"
  },
  shortName: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
    // Ex: "L1", "M2"
  },
  fields: [{
    type: String,
    trim: true
    // Ex: ["Génie Informatique", "Génie Civil", "Génie Électrique"]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Level', levelSchema);
