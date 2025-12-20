const Module = require('../models/Module');

// @desc    Get all modules
// @route   GET /api/modules
// @access  Public
const getAllModules = async (req, res) => {
  try {
    const { level, field, semester } = req.query;

    let query = { isActive: true };

    if (level) query.level = level;
    if (field) query.field = field;
    if (semester) query.semester = semester;

    const modules = await Module.find(query)
      .populate('level')
      .populate({
        path: 'professor',
        populate: { path: 'user', select: 'firstName lastName email' }
      })
      .sort('code');

    res.json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single module
// @route   GET /api/modules/:id
// @access  Public
const getModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('level')
      .populate({
        path: 'professor',
        populate: { path: 'user', select: 'firstName lastName email' }
      });

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    res.json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllModules,
  getModule
};