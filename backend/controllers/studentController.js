const Student = require('../models/Student');
const Module = require('../models/Module');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Grade = require('../models/Grade');
const Notification = require('../models/Notification');

// @desc    Get student dashboard
// @route   GET /api/student/dashboard
// @access  Private (Student)
const getDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('level')
      .populate('enrolledModules');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student profile not found'
      });
    }

    // Get statistics
    const totalModules = student.enrolledModules.length;
    
    const pendingAssignments = await Assignment.countDocuments({
      module: { $in: student.enrolledModules },
      deadline: { $gte: new Date() }
    });

    const unreadNotifications = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });

    const grades = await Grade.find({
      student: student._id,
      semester: student.semester,
      academicYear: student.academicYear,
      isPublished: true
    }).populate('module');

    // Calculate average
    let average = 0;
    if (grades.length > 0) {
      const totalCoefficient = grades.reduce((sum, g) => sum + (g.module.coefficient || 1), 0);
      const weightedSum = grades.reduce((sum, g) => sum + (g.value * (g.module.coefficient || 1)), 0);
      average = weightedSum / totalCoefficient;
    }

    res.json({
      success: true,
      data: {
        student,
        stats: {
          totalModules,
          pendingAssignments,
          unreadNotifications,
          average: average.toFixed(2)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get enrolled modules
// @route   GET /api/student/modules
// @access  Private (Student)
const getModules = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate({
        path: 'enrolledModules',
        populate: {
          path: 'professor',
          populate: { path: 'user', select: 'firstName lastName email' }
        }
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      data: student.enrolledModules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get module details
// @route   GET /api/student/modules/:id
// @access  Private (Student)
const getModuleDetails = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });

    const module = await Module.findById(req.params.id)
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

    // Check if student is enrolled
    if (!student.enrolledModules.includes(module._id)) {
      return res.status(403).json({
        success: false,
        error: 'You are not enrolled in this module'
      });
    }

    // Get assignments for this module
    const assignments = await Assignment.find({ module: module._id });

    // Get student's grade for this module
    const grade = await Grade.findOne({
      student: student._id,
      module: module._id,
      semester: student.semester,
      academicYear: student.academicYear,
      isPublished: true
    });

    res.json({
      success: true,
      data: {
        module,
        assignments,
        grade
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all assignments
// @route   GET /api/student/assignments
// @access  Private (Student)
const getAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });

    const assignments = await Assignment.find({
      module: { $in: student.enrolledModules }
    }).sort('-createdAt');

    // Get student's submissions
    const submissions = await Submission.find({
      student: student._id,
      assignment: { $in: assignments.map(a => a._id) }
    });

    // Map submissions to assignments
    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = submissions.find(s => 
        s.assignment.toString() === assignment._id.toString()
      );
      
      return {
        ...assignment.toObject(),
        submission: submission || null,
        status: submission ? submission.status : 'not_submitted'
      };
    });

    res.json({
      success: true,
      data: assignmentsWithStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Submit assignment
// @route   POST /api/student/submit/:assignmentId
// @access  Private (Student)
const submitAssignment = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const assignment = await Assignment.findById(req.params.assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      student: student._id,
      assignment: assignment._id
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        error: 'You have already submitted this assignment'
      });
    }

    // Check if file uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }

    const submission = await Submission.create({
      assignment: assignment._id,
      student: student._id,
      fileUrl: `/uploads/submissions/${req.file.filename}`,
      fileName: req.file.originalname
    });

    // Create notification for professor
    await Notification.create({
      recipient: assignment.professor,
      sender: req.user._id,
      title: 'New Assignment Submission',
      message: `${req.user.firstName} ${req.user.lastName} submitted ${assignment.title}`,
      type: 'submission',
      relatedTo: {
        model: 'Submission',
        id: submission._id
      }
    });

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get student submissions
// @route   GET /api/student/submissions
// @access  Private (Student)
const getSubmissions = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });

    const submissions = await Submission.find({ student: student._id })
      .sort('-submittedAt');

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get student grades
// @route   GET /api/student/grades
// @access  Private (Student)
const getGrades = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student profile not found'
      });
    }

    // ✅ Fetch ALL grades (both validated and pending) for analysis
    const allGrades = await Grade.find({
      student: student._id
    }).populate('module').sort('-createdAt');

    // ✅ Filter: Only VALIDATED and PUBLISHED grades for student view
    const validatedGrades = allGrades.filter(g => g.validated && g.isPublished);

    // Calculate semester average (only from validated grades)
    const semesterGrades = validatedGrades.filter(g => 
      g.semester === student.semester && 
      g.academicYear === student.academicYear
    );

    let semesterAverage = 0;
    if (semesterGrades.length > 0) {
      const totalCoef = semesterGrades.reduce((sum, g) => sum + (g.module.coefficient || 1), 0);
      const weightedSum = semesterGrades.reduce((sum, g) => sum + (g.value * (g.module.coefficient || 1)), 0);
      semesterAverage = weightedSum / totalCoef;
    }

    // Calculate yearly average (both semesters, only validated)
    const yearlyGrades = validatedGrades.filter(g => g.academicYear === student.academicYear);
    let yearlyAverage = 0;
    if (yearlyGrades.length > 0) {
      const totalCoef = yearlyGrades.reduce((sum, g) => sum + (g.module.coefficient || 1), 0);
      const weightedSum = yearlyGrades.reduce((sum, g) => sum + (g.value * (g.module.coefficient || 1)), 0);
      yearlyAverage = weightedSum / totalCoef;
    }

    res.json({
      success: true,
      data: {
        grades: allGrades, // ✅ Return all grades (frontend will filter)
        semesterAverage: semesterAverage.toFixed(2),
        yearlyAverage: yearlyAverage.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get student notifications
// @route   GET /api/student/notifications
// @access  Private (Student)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort('-createdAt')
      .limit(50);

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/student/notifications/:id
// @access  Private (Student)
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      data: notification
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
  getModules,
  getModuleDetails,
  getAssignments,
  submitAssignment,
  getSubmissions,
  getGrades,
  getNotifications,
  markNotificationRead
};