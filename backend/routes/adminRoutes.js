const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllStudents,
  enrollStudent,
  getAllProfessors,
  assignProfessor,
  getAllModules,
  createModule,
  updateModule,
  deleteModule,
  getAllLevels,
  createLevel,
  validateGrade,
  getAllGrades
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// All routes are protected and require admin role
router.use(protect);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Users Management
router.route('/users')
  .get(getAllUsers)
  .post(createUser);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

// Students Management
router.get('/students', getAllStudents);
router.post('/students/:id/enroll', enrollStudent);

// Professors Management
router.get('/professors', getAllProfessors);
router.post('/professors/:id/assign', assignProfessor);

// Modules Management
router.route('/modules')
  .get(getAllModules)
  .post(createModule);

router.route('/modules/:id')
  .put(updateModule)
  .delete(deleteModule);

// Levels Management
router.route('/levels')
  .get(getAllLevels)
  .post(createLevel);

// Grades Management
router.get('/grades', getAllGrades);
router.patch('/grades/:id/validate', validateGrade);

module.exports = router;