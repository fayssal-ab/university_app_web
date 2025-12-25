const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// ✅ هذا هو السطر المهم
module.exports = mongoose.model('Branch', branchSchema);
