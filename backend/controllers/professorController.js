const Professor = require('../models/Professor');
const Module = require('../models/Module');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Student = require('../models/Student');
const Notification = require('../models/Notification');

// @desc    Get professor dashboard
// @route   GET /api/professor/dashboard
// @access  Private (Professor)
const getDashboard = async (req, res) => {
  try {
    const professor = await Professor.findOne({ user: req.user._id })
      .populate('assignedModules');

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: 'Professor profile not found'
      });
    }

    const totalModules = professor.assignedModules.length;

    const totalAssignments = await Assignment.countDocuments({
      professor: professor._id
    });

    const pendingSubmissions = await Submission.countDocuments({
      assignment: {
        $in: await Assignment.find({ professor: professor._id }).distinct('_id')
      },
      status: 'pending'
    });

    res.json({
      success: true,
      data: {
        professor,
        stats: {
          totalModules,
          totalAssignments,
          pendingSubmissions
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

// @desc    Get professor modules
// @route   GET /api/professor/modules
// @access  Private (Professor)
const getModules = async (req, res) => {
  try {
    const professor = await Professor.findOne({ user: req.user._id })
      .populate('assignedModules');

    res.json({
      success: true,
      data: professor.assignedModules
    });
  } catch (error) {
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

    // Notify students
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

    // Notify students
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

// @desc    Grade submission
// @route   POST /api/professor/grade/:submissionId
// @access  Private (Professor)
const gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(req.params.submissionId)
      .populate('assignment');

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

    // Notify student
    const student = await Student.findById(submission.student);
    
    await Notification.create({
      recipient: student.user,
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

    // Get all students in this module
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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get students in module
// @route   GET /api/professor/students/:moduleId
// @access  Private (Professor)
const getStudentsInModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);

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

    const students = await Student.find({ enrolledModules: module._id })
      .populate('user', 'firstName lastName email');

    res.json({
      success: true,
      data: students
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
  uploadMaterial,
  createAssignment,
  getSubmissions,
  gradeSubmission,
  sendAnnouncement,
  getStudentsInModule
};