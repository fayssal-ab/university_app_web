import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleRoute from './utils/RoleRoute';

// Pages
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentModules from './pages/student/MyModules';
import ModuleDetails from './pages/student/ModuleDetails';
import Assignments from './pages/student/Assignments';
import SubmitAssignment from './pages/student/SubmitAssignment';
import MyGrades from './pages/student/MyGrades';
import Notifications from './pages/student/Notifications';

// Professor Pages
import ProfessorDashboard from './pages/professor/ProfessorDashboard';
import ProfessorModules from './pages/professor/MyModules';
import ManageModule from './pages/professor/ManageModule';
import ManageGrades from './pages/professor/ManageGrades';
import CreateAssignment from './pages/professor/CreateAssignment';
import ViewSubmissions from './pages/professor/ViewSubmissions';
import Announcements from './pages/professor/Announcements';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBranches from './pages/admin/ManageBranches';
import ManageClasses from './pages/admin/ManageClasses';
import ClassStudents from './pages/admin/ClassStudents';
import AddStudent from './pages/admin/AddStudent';
import EditStudent from './pages/admin/EditStudent';
import ManageProfessors from './pages/admin/ManageProfessors';
import ManageModules from './pages/admin/ManageModules';
import EnrollStudents from './pages/admin/EnrollStudents';
import ValidateGrades from './pages/admin/ValidateGrades'; // ✅ IMPORTANT
import ExportGrades from './pages/admin/ExportGrades';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* ========== STUDENT ROUTES ========== */}
          <Route
            path="/student/dashboard"
            element={
              <RoleRoute allowedRoles={['student']}>
                <StudentDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/student/modules"
            element={
              <RoleRoute allowedRoles={['student']}>
                <StudentModules />
              </RoleRoute>
            }
          />
          <Route
            path="/student/modules/:id"
            element={
              <RoleRoute allowedRoles={['student']}>
                <ModuleDetails />
              </RoleRoute>
            }
          />
          <Route
            path="/student/assignments"
            element={
              <RoleRoute allowedRoles={['student']}>
                <Assignments />
              </RoleRoute>
            }
          />
          <Route
            path="/student/submit/:assignmentId"
            element={
              <RoleRoute allowedRoles={['student']}>
                <SubmitAssignment />
              </RoleRoute>
            }
          />
          <Route
            path="/student/grades"
            element={
              <RoleRoute allowedRoles={['student']}>
                <MyGrades />
              </RoleRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <RoleRoute allowedRoles={['student']}>
                <Notifications />
              </RoleRoute>
            }
          />

          {/* ========== PROFESSOR ROUTES ========== */}
          <Route
            path="/professor/dashboard"
            element={
              <RoleRoute allowedRoles={['professor']}>
                <ProfessorDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/professor/modules"
            element={
              <RoleRoute allowedRoles={['professor']}>
                <ProfessorModules />
              </RoleRoute>
            }
          />
          <Route
            path="/professor/modules/:moduleId/manage"
            element={
              <RoleRoute allowedRoles={['professor']}>
                <ManageModule />
              </RoleRoute>
            }
          />
          <Route
            path="/professor/modules/:moduleId/grades"
            element={
              <RoleRoute allowedRoles={['professor']}>
                <ManageGrades />
              </RoleRoute>
            }
          />
          <Route
            path="/professor/assignments/create"
            element={
              <RoleRoute allowedRoles={['professor']}>
                <CreateAssignment />
              </RoleRoute>
            }
          />
          <Route
            path="/professor/assignments/:assignmentId/submissions"
            element={
              <RoleRoute allowedRoles={['professor']}>
                <ViewSubmissions />
              </RoleRoute>
            }
          />
          <Route
            path="/professor/announcements"
            element={
              <RoleRoute allowedRoles={['professor']}>
                <Announcements />
              </RoleRoute>
            }
          />

          {/* ========== ADMIN ROUTES ========== */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/branches"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ManageBranches />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ManageClasses />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/classes/:levelId/students"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ClassStudents />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/students/add"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AddStudent />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/students/:studentId/edit"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <EditStudent />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/professors"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ManageProfessors />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/modules"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ManageModules />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/enroll"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <EnrollStudents />
              </RoleRoute>
            }
          />
          {/* ✅ VALIDATE GRADES ROUTE - IMPORTANT */}
          <Route
            path="/admin/grades"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ValidateGrades />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/export"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ExportGrades />
              </RoleRoute>
            }
          />

          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;