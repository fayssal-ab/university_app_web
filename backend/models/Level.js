const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  name: String,
  shortName: String,
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  academicYear: String,
  capacity: Number
});


// Index for unique combination
levelSchema.index({ shortName: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Level', levelSchema);