const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} = require('../controllers/branchController');

// Middlewares
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

/**
 * =========================
 * Branches routes (ADMIN)
 * =========================
 */

// Protect all routes (user must be logged in)
router.use(protect);

// Only admin can access these routes
router.use(isAdmin);

// GET all branches
router.get('/', getAllBranches);

// CREATE new branch
router.post('/', createBranch);

// UPDATE branch
router.put('/:id', updateBranch);

// DELETE branch
router.delete('/:id', deleteBranch);

module.exports = router;
