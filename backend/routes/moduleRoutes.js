const express = require('express');
const router = express.Router();
const {
  getAllModules,
  getModule
} = require('../controllers/moduleController');
const { protect } = require('../middleware/authMiddleware');

// Public/Protected routes
router.get('/', protect, getAllModules);
router.get('/:id', protect, getModule);

module.exports = router;