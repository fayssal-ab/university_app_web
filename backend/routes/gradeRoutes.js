const express = require('express');
const router = express.Router();
const {
  createGrade,
  publishGrade,
  getGradesByStudent
} = require('../controllers/gradeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes are protected
router.use(protect);

// Create/Update grade (Professor & Admin)
router.post('/', authorize('professor', 'admin'), createGrade);

// Publish grade (Professor & Admin)
router.patch('/:id/publish', authorize('professor', 'admin'), publishGrade);

// Get grades by student
router.get('/student/:studentId', authorize('student', 'professor', 'admin'), getGradesByStudent);

module.exports = router;