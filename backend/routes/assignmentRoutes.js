const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  getAssignment
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/', getAllAssignments);
router.get('/:id', getAssignment);

module.exports = router;