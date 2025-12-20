import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import RoleRoute from './utils/RoleRoute';

// Pages
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyModules from './pages/student/MyModules';
import ModuleDetails from './pages/student/ModuleDetails';
import Assignments from './pages/student/Assignments';
import SubmitAssignment from './pages/student/SubmitAssignment';
import MyGrades from './pages/student/MyGrades';
import Notifications from './pages/student/Notifications';

// Professor Pages
import ProfessorDashboard from './pages/professor/ProfessorDashboard';
import ProfessorModules from './pages/professor/MyModules';
import ManageModule from './pages/professor/ManageModule';
import CreateAssignment from './pages/professor/CreateAssignment';
import ViewSubmissions from './pages/professor/ViewSubmissions';
import Announcements from './pages/professor/Announcements';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageStudents from './pages/admin/ManageStudents';
import ManageProfessors from './pages/admin/ManageProfessors';
import ManageModules from './pages/admin/ManageModules';
import ManageLevels from './pages/admin/ManageLevels';
import EnrollStudents from './pages/admin/EnrollStudents';
import ValidateGrades from './pages/admin/ValidateGrades';
import ExportGrades from './pages/admin/ExportGrades';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* STUDENT ROUTES */}
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
                <MyModules />
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

          {/* PROFESSOR ROUTES */}
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

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ManageUsers />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ManageStudents />
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
            path="/admin/levels"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ManageLevels />
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