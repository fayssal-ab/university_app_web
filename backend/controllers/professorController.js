const Professor = require('../models/Professor');
const Student = require('../models/Student');
const Module = require('../models/Module');
const Grade = require('../models/Grade');
const Notification = require('../models/Notification');

// @desc    Get professor dashboard
// @route   GET /api/professor/dashboard
// @access  Private (Professor)
const getDashboard = async (req, res) => {
  try {
    const professor = await Professor.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'assignedModules.module',
        select: 'code name semester coefficient'
      })
      .populate({
        path: 'assignedModules.level',
        select: 'name shortName'
      });

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor profile not found'
      });
    }

    const modules = await Module.find({ professor: professor._id })
      .populate('level', 'name shortName');

    const totalModules = modules.length;

    let totalStudents = 0;
    for (const module of modules) {
      const count = await Student.countDocuments({
        level: module.level,
        enrolledModules: module._id
      });
      totalStudents += count;
    }

    res.json({
      success: true,
      data: {
        professor,
        stats: {
          totalModules,
          totalStudents
        }
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get professor modules
// @route   GET /api/professor/modules
// @access  Private (Professor)
const getModules = async (req, res) => {
  try {
    const professor = await Professor.findOne({ user: req.user._id });

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor profile not found'
      });
    }

    const modules = await Module.find({ professor: professor._id })
      .populate('level', 'name shortName')
      .populate({
        path: 'level',
        populate: {
          path: 'branch',
          select: 'name code'
        }
      })
      .sort('code');

    const modulesWithStats = await Promise.all(
      modules.map(async (module) => {
        const studentCount = await Student.countDocuments({
          level: module.level._id,
          enrolledModules: module._id
        });

        return {
          ...module.toObject(),
          studentCount
        };
      })
    );

    res.json({
      success: true,
      count: modulesWithStats.length,
      data: modulesWithStats
    });
  } catch (error) {
    console.error('Get Modules Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get students enrolled in a specific module
// @route   GET /api/professor/modules/:moduleId/students
// @access  Private (Professor)
const getModuleStudents = async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    console.log('📚 Fetching module:', moduleId);
    
    const professor = await Professor.findOne({ user: req.user._id });

    if (!professor) {
      console.log('❌ Professor not found');
      return res.status(404).json({
        success: false,
        error: 'Professor profile not found'
      });
    }

    console.log('👨‍🏫 Professor ID:', professor._id);

    let module = await Module.findById(moduleId);

    if (!module) {
      console.log('❌ Module not found:', moduleId);
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    console.log('✅ Module found:', module.name);

    const moduleProfessorId = module.professor ? module.professor.toString() : null;
    const currentProfessorId = professor._id.toString();

    if (moduleProfessorId !== currentProfessorId) {
      console.log('⛔ Authorization failed');
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to view students for this module'
      });
    }

    module = await Module.findById(moduleId)
      .populate({
        path: 'level',
        select: 'name shortName',
        populate: {
          path: 'branch',
          select: 'name code'
        }
      });

    const students = await Student.find({
      level: module.level._id,
      enrolledModules: moduleId
    })
      .populate('user', 'firstName lastName email')
      .populate('level', 'name shortName')
      .sort('studentId');

    console.log('👥 Students found:', students.length);

    const studentIds = students.map(s => s._id);
    const grades = await Grade.find({
      student: { $in: studentIds },
      module: moduleId
    });

    console.log('📊 Grades found:', grades.length);

    const studentsWithGrades = students.map(student => {
      const studentGrades = grades.filter(
        g => g.student && g.student.toString() === student._id.toString()
      );

      return {
        _id: student._id,
        studentId: student.studentId,
        user: student.user,
        level: student.level,
        field: student.field,
        semester: student.semester,
        academicYear: student.academicYear,
        enrolledModules: student.enrolledModules,
        grades: studentGrades
      };
    });

    res.json({
      success: true,
      count: studentsWithGrades.length,
      data: {
        module: {
          _id: module._id,
          code: module.code,
          name: module.name,
          description: module.description,
          semester: module.semester,
          level: module.level,
          coefficient: module.coefficient,
          academicYear: module.academicYear,
          materials: module.materials || []
        },
        students: studentsWithGrades
      }
    });
  } catch (error) {
    console.error('❌ ERROR in getModuleStudents:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};

// @desc    Add or update grade for a student
// @route   POST /api/professor/grades
// @access  Private (Professor)
const addGrade = async (req, res) => {
  try {
    const { studentId, moduleId, value, semester, academicYear, gradeType, comments } = req.body;

    const professor = await Professor.findOne({ user: req.user._id });

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor profile not found'
      });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    if (module.professor.toString() !== professor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to grade this module'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    if (!student.enrolledModules.includes(moduleId)) {
      return res.status(400).json({
        success: false,
        error: 'Student is not enrolled in this module'
      });
    }

    if (value < 0 || value > 20) {
      return res.status(400).json({
        success: false,
        error: 'Grade must be between 0 and 20'
      });
    }

    let grade = await Grade.findOne({
      student: studentId,
      module: moduleId,
      semester,
      academicYear,
      gradeType: gradeType || 'final'
    });

    if (grade) {
      if (grade.validated) {
        return res.status(403).json({
          success: false,
          error: 'Cannot modify a validated grade. Contact admin if changes are needed.'
        });
      }

      grade.value = value;
      grade.comments = comments;
      grade.validated = false;
      grade.validatedBy = null;
      grade.validatedAt = null;
      grade.isPublished = false;
      await grade.save();
    } else {
      grade = await Grade.create({
        student: studentId,
        module: moduleId,
        value,
        semester,
        academicYear,
        gradeType: gradeType || 'final',
        comments,
        validated: false,
        isPublished: false
      });
    }

    await grade.populate('student module');

    res.status(201).json({
      success: true,
      data: grade,
      message: 'Grade saved successfully. Waiting for admin validation.'
    });
  } catch (error) {
    console.error('Add Grade Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get grades for a specific module
// @route   GET /api/professor/modules/:moduleId/grades
// @access  Private (Professor)
const getModuleGrades = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const professor = await Professor.findOne({ user: req.user._id });

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor profile not found'
      });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    if (module.professor.toString() !== professor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    const grades = await Grade.find({ module: moduleId })
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      })
      .populate('module', 'code name coefficient')
      .sort('student');

    res.json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (error) {
    console.error('Get Module Grades Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Upload course material
// @route   POST /api/professor/materials
// @access  Private (Professor)
const uploadMaterial = async (req, res) => {
  try {
    const { moduleId, title, description } = req.body;

    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    const professor = await Professor.findOne({ user: req.user._id });

    if (module.professor.toString() !== professor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to upload materials for this module'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }

    const material = {
      title,
      description,
      fileUrl: `/uploads/materials/${req.file.filename}`,
      fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'other'
    };

    module.materials.push(material);
    await module.save();

    const students = await Student.find({ enrolledModules: module._id });
    
    const notifications = students.map(student => ({
      recipient: student.user,
      sender: req.user._id,
      title: 'New Course Material',
      message: `New material "${title}" uploaded for ${module.name}`,
      type: 'announcement'
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error('Upload Material Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Send announcement
// @route   POST /api/professor/announcements
// @access  Private (Professor)
const sendAnnouncement = async (req, res) => {
  try {
    const { moduleId, title, message } = req.body;

    console.log('📤 Announcement request received:', { moduleId, title, message });

    const module = await Module.findById(moduleId);

    if (!module) {
      console.log('❌ Module not found');
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    console.log('✅ Module found:', module.name);

    const professor = await Professor.findOne({ user: req.user._id });

    if (!professor) {
      console.log('❌ Professor not found');
      return res.status(404).json({
        success: false,
        error: 'Professor profile not found'
      });
    }

    if (module.professor.toString() !== professor._id.toString()) {
      console.log('❌ Not authorized');
      return res.status(403).json({
        success: false,
        error: 'Not authorized to send announcements for this module'
      });
    }

    console.log('✅ Authorization passed');

    const students = await Student.find({ enrolledModules: module._id })
      .populate('user', '_id firstName lastName email');

    console.log(`👥 Found ${students.length} students enrolled`);

    if (students.length === 0) {
      return res.json({
        success: true,
        message: 'No students enrolled in this module to notify'
      });
    }

    const notifications = [];
    
    for (const student of students) {
      if (student.user && student.user._id) {
        notifications.push({
          recipient: student.user._id,
          sender: req.user._id,
          title: title,
          message: message,
          type: 'announcement'
        });
      } else {
        console.warn(`⚠️ Student ${student.studentId} has no valid user`);
      }
    }

    console.log(`📨 Creating ${notifications.length} notifications`);

    if (notifications.length > 0) {
      const result = await Notification.insertMany(notifications);
      console.log(`✅ ${result.length} notifications created successfully`);
    }

    res.json({
      success: true,
      message: `Announcement sent to ${notifications.length} student(s)`,
      data: {
        studentsNotified: notifications.length,
        moduleName: module.name,
        moduleCode: module.code
      }
    });

  } catch (error) {
    console.error('❌ Send Announcement Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getDashboard,
  getModules,
  getModuleStudents,
  addGrade,
  getModuleGrades,
  uploadMaterial,
  sendAnnouncement
};