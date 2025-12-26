const express = require('express');
const router = express.Router();

// Controllers
const {
  getDashboard,

  // Levels (Classes)
  getAllLevels,
  createLevel,
  updateLevel,
  deleteLevel,
  getStudentsByLevel,

  // Students
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  enrollStudent,

  // Professors
  getAllProfessors,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  assignProfessorToModule,

  // Modules
  getAllModules,
  createModule,
  updateModule,
  deleteModule,

  // Grades
  getAllGrades,
  validateGrade
} = require('../controllers/adminController');

// Branch Controller
const {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch
} = require('../controllers/branchController');

// Middleware
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

/*
|--------------------------------------------------------------------------
| ADMIN middleware (required for all routes)
|--------------------------------------------------------------------------
*/
router.use(protect);
router.use(isAdmin);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
router.get('/dashboard', getDashboard);

/*
|--------------------------------------------------------------------------
| BRANCHES
|--------------------------------------------------------------------------
*/
router.route('/branches')
  .get(getAllBranches)
  .post(createBranch);

router.route('/branches/:id')
  .put(updateBranch)
  .delete(deleteBranch);

/*
|--------------------------------------------------------------------------
| Levels / Classes
|--------------------------------------------------------------------------
*/
router.route('/levels')
  .get(getAllLevels)
  .post(createLevel);

router.route('/levels/:id')
  .put(updateLevel)
  .delete(deleteLevel);

/*
|--------------------------------------------------------------------------
| Students by Level
|--------------------------------------------------------------------------
*/
router.get('/levels/:levelId/students', getStudentsByLevel);

/*
|--------------------------------------------------------------------------
| Students
|--------------------------------------------------------------------------
*/
router.route('/students')
  .get(getAllStudents)
  .post(createStudent);

router.route('/students/:id')
  .put(updateStudent)
  .delete(deleteStudent);

router.post('/students/:id/enroll', enrollStudent);

/*
|--------------------------------------------------------------------------
| Professors
|--------------------------------------------------------------------------
*/
router.route('/professors')
  .get(getAllProfessors)
  .post(createProfessor);

router.route('/professors/:id')
  .put(updateProfessor)
  .delete(deleteProfessor);

router.post('/professors/:id/assign', assignProfessorToModule);

/*
|--------------------------------------------------------------------------
| Modules
|--------------------------------------------------------------------------
*/
router.route('/modules')
  .get(getAllModules)
  .post(createModule);

router.route('/modules/:id')
  .put(updateModule)
  .delete(deleteModule);

/*
|--------------------------------------------------------------------------
| Grades
|--------------------------------------------------------------------------
*/
router.get('/grades', getAllGrades);
router.patch('/grades/:id/validate', validateGrade);

module.exports = router;