const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Module = require('../models/Module');
const Notification = require('../models/Notification');

// @desc    Create/Update grade
// @route   POST /api/grades
// @access  Private (Professor/Admin)
const createGrade = async (req, res) => {
  try {
    const { studentId, moduleId, value, semester, academicYear, gradeType, comments } = req.body;

    const student = await Student.findById(studentId);
    const module = await Module.findById(moduleId);

    if (!student || !module) {
      return res.status(404).json({
        success: false,
        error: 'Student or Module not found'
      });
    }

    // Check if grade already exists
    let grade = await Grade.findOne({
      student: studentId,
      module: moduleId,
      semester,
      academicYear,
      gradeType
    });

    if (grade) {
      // Update existing grade
      grade.value = value;
      grade.comments = comments;
      await grade.save();
    } else {
      // Create new grade
      grade = await Grade.create({
        student: studentId,
        module: moduleId,
        value,
        semester,
        academicYear,
        gradeType,
        comments
      });
    }

    res.status(201).json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Publish grade
// @route   PATCH /api/grades/:id/publish
// @access  Private (Professor/Admin)
const publishGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate('student module');

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: 'Grade not found'
      });
    }

    grade.isPublished = true;
    grade.publishedAt = Date.now();
    await grade.save();

    // Notify student
    await Notification.create({
      recipient: grade.student.user,
      sender: req.user._id,
      title: 'New Grade Published',
      message: `Your grade for ${grade.module.name} has been published: ${grade.value}/20`,
      type: 'grade',
      relatedTo: {
        model: 'Grade',
        id: grade._id
      }
    });

    res.json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get grades by student
// @route   GET /api/grades/student/:studentId
// @access  Private
const getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('module')
      .sort('-createdAt');

    res.json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createGrade,
  publishGrade,
  getGradesByStudent
};