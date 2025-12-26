const express = require('express');
const router = express.Router();
const {
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

// ✅ THIS IS THE IMPORTANT ROUTE - Get module with students
router.get('/modules/:moduleId/students', getModuleStudents);

// Grades
router.get('/modules/:moduleId/grades', getModuleGrades);
router.post('/grades', addGrade);

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