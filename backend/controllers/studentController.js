const Student = require('../models/Student');
const Module = require('../models/Module');
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

    // Fetch ALL grades
    const allGrades = await Grade.find({
      student: student._id
    }).populate('module').sort('-createdAt');

    // Filter: Only VALIDATED and PUBLISHED grades for student view
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
        grades: allGrades,
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
    console.log('🔔 Fetching notifications for user:', req.user._id);

    const notifications = await Notification.find({ 
      recipient: req.user._id 
    })
      .populate('sender', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email')
      .sort('-createdAt')
      .limit(50);

    console.log(`✅ Found ${notifications.length} notifications`);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
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
  getGrades,
  getNotifications,
  markNotificationRead
};