const User = require('../models/User');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Module = require('../models/Module');
const Level = require('../models/Level');
const Branch = require('../models/Branch');
const Grade = require('../models/Grade');

// ==================== DASHBOARD ====================

// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboard = async (req, res) => {
  try {
    const totalBranches = await Branch.countDocuments();
    const totalLevels = await Level.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalProfessors = await Professor.countDocuments();
    const totalModules = await Module.countDocuments();

    res.json({
      success: true,
      data: {
        totalBranches,
        totalLevels,
        totalStudents,
        totalProfessors,
        totalModules
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ==================== LEVELS (CLASSES) ====================

// @desc    Get all levels
// @route   GET /api/admin/levels
// @access  Private (Admin)
const getAllLevels = async (req, res) => {
  try {
    const { branchId } = req.query;
    
    let query = {};
    if (branchId) query.branch = branchId;

    const levels = await Level.find(query)
      .populate('branch', 'name code')
      .sort('shortName');

    const levelsWithCount = await Promise.all(
      levels.map(async (level) => {
        const studentCount = await Student.countDocuments({ level: level._id });
        const moduleCount = await Module.countDocuments({ level: level._id });
        
        return {
          ...level.toObject(),
          studentCount,
          moduleCount
        };
      })
    );

    res.json({
      success: true,
      count: levelsWithCount.length,
      data: levelsWithCount
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

    const populatedLevel = await Level.findById(level._id)
      .populate('branch', 'name code');

    res.status(201).json({
      success: true,
      data: populatedLevel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update level
// @route   PUT /api/admin/levels/:id
// @access  Private (Admin)
const updateLevel = async (req, res) => {
  try {
    const level = await Level.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('branch', 'name code');

    if (!level) {
      return res.status(404).json({
        success: false,
        error: 'Level not found'
      });
    }

    res.json({
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

// @desc    Delete level
// @route   DELETE /api/admin/levels/:id
// @access  Private (Admin)
const deleteLevel = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);

    if (!level) {
      return res.status(404).json({
        success: false,
        error: 'Level not found'
      });
    }

    const studentCount = await Student.countDocuments({ level: level._id });
    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete level with enrolled students'
      });
    }

    await level.deleteOne();

    res.json({
      success: true,
      message: 'Level deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get students by level
// @route   GET /api/admin/levels/:levelId/students
// @access  Private (Admin)
const getStudentsByLevel = async (req, res) => {
  try {
    const { levelId } = req.params;

    const level = await Level.findById(levelId);
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    const students = await Student.find({ level: levelId })
      .populate('user', 'firstName lastName email isActive')
      .populate('level', 'name shortName')
      .populate('enrolledModules', 'code name');

    res.status(200).json(students);
  } catch (error) {
    console.error('getStudentsByLevel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== STUDENTS ====================

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'firstName lastName email isActive')
      .populate('level', 'name shortName')
      .populate('enrolledModules', 'code name')
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

// @desc    Create student
// @route   POST /api/admin/students
// @access  Private (Admin)
const createStudent = async (req, res) => {
  try {
    const { email, password, firstName, lastName, studentId, level, academicYear } = req.body;

    const levelData = await Level.findById(level).populate('branch');
    if (!levelData) {
      return res.status(400).json({ error: 'Invalid level' });
    }

    const user = await User.create({
      email,
      password,
      role: 'student',
      firstName,
      lastName
    });

    const student = await Student.create({
      user: user._id,
      studentId,
      level,
      field: levelData.branch.name,
      semester: 1,
      academicYear
    });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/admin/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const { firstName, lastName, branch, level, academicYear } = req.body;

    if (firstName || lastName) {
      await User.findByIdAndUpdate(student.user, {
        firstName,
        lastName
      });
    }

    if (branch) student.branch = branch;
    if (level) student.level = level;
    if (academicYear) student.academicYear = academicYear;

    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .populate('user', 'firstName lastName email')
      .populate('level', 'name shortName');

    res.json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    await User.findByIdAndDelete(student.user);
    await student.deleteOne();

    res.json({
      success: true,
      message: 'Student deleted successfully'
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

    const updatedStudent = await Student.findById(student._id)
      .populate('enrolledModules', 'code name');

    res.json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ==================== PROFESSORS ====================

// @desc    Get all professors
// @route   GET /api/admin/professors
// @access  Private (Admin)
const getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find()
      .populate('user', 'firstName lastName email isActive')
      .populate('branches', 'name code') // ✅ Populate branches
      .populate('assignedModules.module', 'code name')
      .populate('assignedModules.level', 'name shortName')
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

// @desc    Create professor
// @route   POST /api/admin/professors
// @access  Private (Admin)
const createProfessor = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      professorId, 
      department, 
      specialization, 
      branches, // ✅ Accept branches array
      phoneNumber, 
      officeLocation 
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Check if professorId exists
    const profIdExists = await Professor.findOne({ professorId });
    if (profIdExists) {
      return res.status(400).json({
        success: false,
        error: 'Professor ID already exists'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role: 'professor',
      firstName,
      lastName
    });

    // Create professor with branches
    const professor = await Professor.create({
      user: user._id,
      professorId,
      department,
      specialization,
      branches: branches || [], // ✅ Save branches
      phoneNumber,
      officeLocation
    });

    const populatedProfessor = await Professor.findById(professor._id)
      .populate('user', 'firstName lastName email')
      .populate('branches', 'name code'); // ✅ Populate branches

    res.status(201).json({
      success: true,
      data: populatedProfessor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update professor
// @route   PUT /api/admin/professors/:id
// @access  Private (Admin)
const updateProfessor = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor not found'
      });
    }

    const { 
      firstName, 
      lastName, 
      department, 
      specialization, 
      branches, // ✅ Update branches
      phoneNumber, 
      officeLocation 
    } = req.body;

    // Update user info
    if (firstName || lastName) {
      await User.findByIdAndUpdate(professor.user, {
        firstName,
        lastName
      });
    }

    // Update professor info
    if (department) professor.department = department;
    if (specialization) professor.specialization = specialization;
    if (branches) professor.branches = branches; // ✅ Update branches
    if (phoneNumber) professor.phoneNumber = phoneNumber;
    if (officeLocation) professor.officeLocation = officeLocation;

    await professor.save();

    const updatedProfessor = await Professor.findById(professor._id)
      .populate('user', 'firstName lastName email')
      .populate('branches', 'name code'); // ✅ Populate branches

    res.json({
      success: true,
      data: updatedProfessor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete professor
// @route   DELETE /api/admin/professors/:id
// @access  Private (Admin)
const deleteProfessor = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor not found'
      });
    }

    await User.findByIdAndDelete(professor.user);
    await professor.deleteOne();

    res.json({
      success: true,
      message: 'Professor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Assign professor to module
// @route   POST /api/admin/professors/:id/assign
// @access  Private (Admin)
const assignProfessorToModule = async (req, res) => {
  try {
    const { moduleId, levelId, academicYear } = req.body;

    const professor = await Professor.findById(req.params.id);
    const module = await Module.findById(moduleId);

    if (!professor || !module) {
      return res.status(404).json({
        success: false,
        error: 'Professor or Module not found'
      });
    }

    module.professor = professor._id;
    await module.save();

    const existingAssignment = professor.assignedModules.find(
      am => am.module.toString() === moduleId && am.level.toString() === levelId
    );

    if (!existingAssignment) {
      professor.assignedModules.push({
        module: moduleId,
        level: levelId,
        academicYear
      });
      await professor.save();
    }

    const updatedProfessor = await Professor.findById(professor._id)
      .populate('assignedModules.module')
      .populate('assignedModules.level');

    res.json({
      success: true,
      data: updatedProfessor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ==================== MODULES ====================

// @desc    Get all modules
// @route   GET /api/admin/modules
// @access  Private (Admin)
const getAllModules = async (req, res) => {
  try {
    const { branchId, levelId } = req.query;

    let query = {};
    if (branchId) query.branch = branchId;
    if (levelId) query.level = levelId;

    const modules = await Module.find(query)
      .populate({
        path: 'level',
        select: 'name shortName',
        populate: {
          path: 'branch', // ✅ Populate branch inside level
          select: 'name code'
        }
      })
      .populate({
        path: 'professor',
        populate: { path: 'user', select: 'firstName lastName' }
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

// @desc    Create module
// @route   POST /api/admin/modules
// @access  Private (Admin)
const createModule = async (req, res) => {
  try {
    const module = await Module.create(req.body);

    const populatedModule = await Module.findById(module._id)
      .populate({
        path: 'level',
        select: 'name shortName',
        populate: {
          path: 'branch',
          select: 'name code'
        }
      })
      .populate({
        path: 'professor',
        populate: { path: 'user', select: 'firstName lastName' }
      });

    res.status(201).json({
      success: true,
      data: populatedModule
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
    )
    .populate({
      path: 'level',
      select: 'name shortName',
      populate: {
        path: 'branch',
        select: 'name code'
      }
    })
    .populate({
      path: 'professor',
      populate: { path: 'user', select: 'firstName lastName' }
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

// ==================== GRADES ====================

// @desc    Get all grades
// @route   GET /api/admin/grades
// @access  Private (Admin)
const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .populate('module', 'code name')
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

// @desc    Validate grade (Admin only)
// @route   PATCH /api/admin/grades/:id/validate
// @access  Private (Admin)
const validateGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'firstName lastName email' }
      })
      .populate('module', 'code name');

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: 'Grade not found'
      });
    }

    // Check if already validated
    if (grade.validated) {
      return res.status(400).json({
        success: false,
        error: 'Grade is already validated'
      });
    }

    // ✅ Validate and publish the grade
    grade.validated = true;
    grade.validatedBy = req.user._id;
    grade.validatedAt = Date.now();
    grade.isPublished = true; // ✅ Publish so student can see it
    grade.publishedAt = Date.now();

    await grade.save();

    // ✅ Notify student that grade is now available
    await Notification.create({
      recipient: grade.student.user._id,
      sender: req.user._id,
      title: 'Grade Published',
      message: `Your grade for ${grade.module.name} (${grade.module.code}) has been validated and published: ${grade.value}/20`,
      type: 'grade',
      relatedTo: {
        model: 'Grade',
        id: grade._id
      }
    });

    res.json({
      success: true,
      data: grade,
      message: 'Grade validated and published successfully'
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
  
  // Levels
  getAllLevels,
  createLevel,
  updateLevel,
  deleteLevel,
  getStudentsByLevel,
  
  // Students
  getAllStudents,    // ✅ Make sure this function exists above
  createStudent,
  updateStudent,
  deleteStudent,
  enrollStudent,
  
  // Professors
  getAllProfessors,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  assignProfessorToModule,
  
  // Modules
  getAllModules,
  createModule,
  updateModule,
  deleteModule,
  
  // Grades
  getAllGrades,
  validateGrade
};