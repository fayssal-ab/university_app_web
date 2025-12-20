const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getModules,
  uploadMaterial,
  createAssignment,
  getSubmissions,
  gradeSubmission,
  sendAnnouncement,
  getStudentsInModule
} = require('../controllers/professorController');
const { protect } = require('../middleware/authMiddleware');
const { isProfessor } = require('../middleware/roleMiddleware');
const { uploadSingle, handleUploadError } = require('../middleware/uploadMiddleware');

// All routes are protected and require professor role
router.use(protect);
router.use(isProfessor);

// Dashboard
router.get('/dashboard', getDashboard);

// Modules
router.get('/modules', getModules);
router.get('/students/:moduleId', getStudentsInModule);

// Materials
router.post(
  '/materials',
  uploadSingle('material'),
  handleUploadError,
  uploadMaterial
);

// Assignments
router.post('/assignments', createAssignment);
router.get('/assignments/:id/submissions', getSubmissions);

// Grading
router.post('/grade/:submissionId', gradeSubmission);

// Announcements
router.post('/announcements', sendAnnouncement);

module.exports = router;