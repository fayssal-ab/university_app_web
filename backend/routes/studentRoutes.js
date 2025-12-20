const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getModules,
  getModuleDetails,
  getAssignments,
  submitAssignment,
  getSubmissions,
  getGrades,
  getNotifications,
  markNotificationRead
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { isStudent } = require('../middleware/roleMiddleware');
const { uploadSingle, handleUploadError } = require('../middleware/uploadMiddleware');

// All routes are protected and require student role
router.use(protect);
router.use(isStudent);

// Dashboard
router.get('/dashboard', getDashboard);

// Modules
router.get('/modules', getModules);
router.get('/modules/:id', getModuleDetails);

// Assignments
router.get('/assignments', getAssignments);
router.post(
  '/submit/:assignmentId',
  uploadSingle('submission'),
  handleUploadError,
  submitAssignment
);
router.get('/submissions', getSubmissions);

// Grades
router.get('/grades', getGrades);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id', markNotificationRead);

module.exports = router;