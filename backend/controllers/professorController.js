const Professor = require('../models/Professor');
const Student = require('../models/Student');
const Module = require('../models/Module');
const Grade = require('../models/Grade');
const Notification = require('../models/Notification');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

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

    const totalAssignments = await Assignment.countDocuments({
      professor: professor._id
    });

    const pendingSubmissions = await Submission.countDocuments({
      assignment: {
        $in: await Assignment.find({ professor: professor._id }).distinct('_id')
      },
      status: 'pending'
    });

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
          totalAssignments,
          pendingSubmissions,
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
    
    const professor = await Professor.findOne({ user: req.user._id });

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor profile not found'
      });
    }

    const module = await Module.findById(moduleId).populate('level');

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    if (module.professor.toString() !== professor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to view students for this module'
      });
    }

    const students = await Student.find({
      level: module.level._id,
      enrolledModules: moduleId
    })
      .populate('user', 'firstName lastName email')
      .populate('level', 'name shortName')
      .sort('studentId');

    const studentIds = students.map(s => s._id);
    const grades = await Grade.find({
      student: { $in: studentIds },
      module: moduleId,
      academicYear: module.academicYear
    });

    const studentsWithGrades = students.map(student => {
      const studentGrades = grades.filter(
        g => g.student.toString() === student._id.toString()
      );

      return {
        ...student.toObject(),
        grades: studentGrades
      };
    });

    res.json({
      success: true,
      count: studentsWithGrades.length,
      data: {
        module: module,
        students: studentsWithGrades
      }
    });
  } catch (error) {
    console.error('Get Module Students Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
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
      grade.value = value;
      grade.comments = comments;
      grade.validated = false;
      grade.validatedBy = null;
      grade.validatedAt = null;
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
      data: grade
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

// @desc    Create assignment
// @route   POST /api/professor/assignments
// @access  Private (Professor)
const createAssignment = async (req, res) => {
  try {
    const { title, description, moduleId, deadline, maxGrade, instructions } = req.body;

    const professor = await Professor.findOne({ user: req.user._id });

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

    const assignment = await Assignment.create({
      title,
      description,
      module: moduleId,
      professor: professor._id,
      deadline,
      maxGrade: maxGrade || 20,
      instructions
    });

    const students = await Student.find({ enrolledModules: module._id });
    
    const notifications = students.map(student => ({
      recipient: student.user,
      sender: req.user._id,
      title: 'New Assignment',
      message: `New assignment "${title}" for ${module.name}. Deadline: ${new Date(deadline).toLocaleDateString()}`,
      type: 'assignment',
      relatedTo: {
        model: 'Assignment',
        id: assignment._id
      }
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Create Assignment Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get assignment submissions
// @route   GET /api/professor/assignments/:id/submissions
// @access  Private (Professor)
const getSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    const professor = await Professor.findOne({ user: req.user._id });

    if (assignment.professor.toString() !== professor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    const submissions = await Submission.find({ assignment: assignment._id })
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      })
      .populate('assignment', 'title maxGrade')
      .sort('-submittedAt');

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Get Submissions Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Grade submission
// @route   POST /api/professor/grade/:submissionId
// @access  Private (Professor)
const gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(req.params.submissionId)
      .populate('assignment')
      .populate({
        path: 'student',
        populate: { path: 'user' }
      });

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    const professor = await Professor.findOne({ user: req.user._id });

    if (submission.assignment.professor.toString() !== professor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    if (grade > submission.assignment.maxGrade) {
      return res.status(400).json({
        success: false,
        error: `Grade cannot exceed ${submission.assignment.maxGrade}`
      });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.gradedBy = professor._id;
    submission.gradedAt = Date.now();

    await submission.save();

    await Notification.create({
      recipient: submission.student.user._id,
      sender: req.user._id,
      title: 'Assignment Graded',
      message: `Your submission for "${submission.assignment.title}" has been graded: ${grade}/${submission.assignment.maxGrade}`,
      type: 'grade',
      relatedTo: {
        model: 'Submission',
        id: submission._id
      }
    });

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Grade Submission Error:', error);
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
        error: 'Not authorized'
      });
    }

    const students = await Student.find({ enrolledModules: module._id });

    const notifications = students.map(student => ({
      recipient: student.user,
      sender: req.user._id,
      title,
      message,
      type: 'announcement'
    }));

    await Notification.insertMany(notifications);

    res.json({
      success: true,
      message: `Announcement sent to ${students.length} students`
    });
  } catch (error) {
    console.error('Send Announcement Error:', error);
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
  createAssignment,
  getSubmissions,
  gradeSubmission,
  sendAnnouncement
};