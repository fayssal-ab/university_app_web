const Assignment = require('../models/Assignment');
const Module = require('../models/Module');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAllAssignments = async (req, res) => {
  try {
    const { moduleId } = req.query;

    let query = { isActive: true };
    if (moduleId) query.module = moduleId;

    const assignments = await Assignment.find(query).sort('-createdAt');

    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllAssignments,
  getAssignment
};