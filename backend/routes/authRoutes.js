const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updatePassword,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/updatepassword', protect, updatePassword);
router.put('/updateprofile', protect, updateProfile);

module.exports = router;