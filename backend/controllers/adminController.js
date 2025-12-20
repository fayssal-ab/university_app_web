const User = require('../models/User');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Module = require('../models/Module');
const Level = require('../models/Level');
const Grade = require('../models/Grade');

// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalProfessors = await Professor.countDocuments();
    const totalModules = await Module.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      data: {
        totalStudents,
        totalProfessors,
        totalModules,
        totalUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, ...otherData } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    const user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName
    });

    if (role === 'student') {
      await Student.create({
        user: user._id,
        studentId: otherData.studentId,
        level: otherData.level,
        field: otherData.field,
        semester: otherData.semester,
        academicYear: otherData.academicYear
      });
    } else if (role === 'professor') {
      await Professor.create({
        user: user._id,
        professorId: otherData.professorId,
        department: otherData.department,
        specialization: otherData.specialization
      });
    }

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete associated profile
    if (user.role === 'student') {
      await Student.findOneAndDelete({ user: user._id });
    } else if (user.role === 'professor') {
      await Professor.findOneAndDelete({ user: user._id });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'firstName lastName email')
      .populate('level')
      .sort('-createdAt');

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Enroll student in modules
// @route   POST /api/admin/students/:id/enroll
// @access  Private (Admin)
const enrollStudent = async (req, res) => {
  try {
    const { moduleIds } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    student.enrolledModules = [...new Set([...student.enrolledModules, ...moduleIds])];
    await student.save();

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all professors
// @route   GET /api/admin/professors
// @access  Private (Admin)
const getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find()
      .populate('user', 'firstName lastName email')
      .populate('assignedModules')
      .sort('-createdAt');

    res.json({
      success: true,
      count: professors.length,
      data: professors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Assign professor to modules
// @route   POST /api/admin/professors/:id/assign
// @access  Private (Admin)
const assignProfessor = async (req, res) => {
  try {
    const { moduleIds } = req.body;

    const professor = await Professor.findById(req.params.id);

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor not found'
      });
    }

    // Update professor's assigned modules
    professor.assignedModules = [...new Set([...professor.assignedModules, ...moduleIds])];
    await professor.save();

    // Update modules with professor
    await Module.updateMany(
      { _id: { $in: moduleIds } },
      { professor: professor._id }
    );

    res.json({
      success: true,
      data: professor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all modules
// @route   GET /api/admin/modules
// @access  Private (Admin)
const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find()
      .populate('level')
      .populate({
        path: 'professor',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .sort('-createdAt');

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

// @desc    Create module
// @route   POST /api/admin/modules
// @access  Private (Admin)
const createModule = async (req, res) => {
  try {
    const module = await Module.create(req.body);

    res.status(201).json({
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

// @desc    Update module
// @route   PUT /api/admin/modules/:id
// @access  Private (Admin)
const updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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

// @desc    Delete module
// @route   DELETE /api/admin/modules/:id
// @access  Private (Admin)
const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    await module.deleteOne();

    res.json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all levels
// @route   GET /api/admin/levels
// @access  Private (Admin)
const getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find().sort('shortName');

    res.json({
      success: true,
      count: levels.length,
      data: levels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create level
// @route   POST /api/admin/levels
// @access  Private (Admin)
const createLevel = async (req, res) => {
  try {
    const level = await Level.create(req.body);

    res.status(201).json({
      success: true,
      data: level
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Validate grade
// @route   PATCH /api/admin/grades/:id/validate
// @access  Private (Admin)
const validateGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: 'Grade not found'
      });
    }

    grade.validated = true;
    grade.validatedBy = req.user._id;
    grade.validatedAt = Date.now();
    grade.isPublished = true;
    grade.publishedAt = Date.now();

    await grade.save();

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

// @desc    Get all grades
// @route   GET /api/admin/grades
// @access  Private (Admin)
const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find().sort('-createdAt');

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
  getDashboard,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllStudents,
  enrollStudent,
  getAllProfessors,
  assignProfessor,
  getAllModules,
  createModule,
  updateModule,
  deleteModule,
  getAllLevels,
  createLevel,
  validateGrade,
  getAllGrades
};