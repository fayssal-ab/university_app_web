// ========================================
// Sidebar.jsx - Updated with all your pages
// ========================================
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaBook,
  FaTasks,
  FaGraduationCap,
  FaBell,
  FaChalkboardTeacher,
  FaFileAlt,
  FaBullhorn,
  FaUsers,
  FaUserPlus,
  FaFileExport,
  FaCheckCircle,
  FaUniversity,
  FaUserTie,
  FaUpload,
  FaListAlt,
  FaCalendarAlt,
  FaFileUpload,
  FaEye
} from 'react-icons/fa';
import { useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

  // جميع الروابط الموجودة في مشروعك
  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: FaHome },
    { name: 'My Modules', path: '/student/modules', icon: FaBook },
    { name: 'Module Details', path: '/student/module/:id', icon: FaBook, dynamic: true },
    { name: 'Assignments', path: '/student/assignments', icon: FaTasks },
    { name: 'Submit Assignment', path: '/student/submit/:id', icon: FaFileUpload, dynamic: true },
    { name: 'My Grades', path: '/student/grades', icon: FaGraduationCap },
    { name: 'Notifications', path: '/student/notifications', icon: FaBell }
  ];

  const professorLinks = [
    { name: 'Dashboard', path: '/professor/dashboard', icon: FaHome },
    { name: 'My Modules', path: '/professor/modules', icon: FaBook },
    { name: 'Manage Module', path: '/professor/module/:id', icon: FaBook, dynamic: true },
    { name: 'Create Assignment', path: '/professor/assignments/create', icon: FaTasks },
    { name: 'View Submissions', path: '/professor/submissions/:id', icon: FaEye, dynamic: true },
    { name: 'Manage Grades', path: '/professor/grades', icon: FaGraduationCap },
    { name: 'Announcements', path: '/professor/announcements', icon: FaBullhorn },
    { name: 'Material Upload', path: '/professor/material/upload', icon: FaUpload }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
    { name: 'Manage Branches', path: '/admin/branches', icon: FaUniversity },
    { name: 'Manage Classes', path: '/admin/classes', icon: FaGraduationCap },
    { name: 'Class Students', path: '/admin/class/:id/students', icon: FaUsers, dynamic: true },
    { name: 'Manage Professors', path: '/admin/professors', icon: FaUserTie },
    { name: 'Add Student', path: '/admin/students/add', icon: FaUserPlus },
    { name: 'Manage Modules', path: '/admin/modules', icon: FaBook },
    { name: 'Enroll Students', path: '/admin/enroll', icon: FaUsers },
    { name: 'Validate Grades', path: '/admin/grades/validate', icon: FaCheckCircle },
    { name: 'Export Grades', path: '/admin/grades/export', icon: FaFileExport }
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'student':
        return studentLinks.filter(link => !link.dynamic); // إظهار الروابط الثابتة فقط
      case 'professor':
        return professorLinks.filter(link => !link.dynamic);
      case 'admin':
        return adminLinks.filter(link => !link.dynamic);
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 lg:hidden z-30 transition-opacity duration-300"
          onClick={() => {
            setTimeout(() => onClose(), 150);
          }}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative left-0 top-[68px] lg:top-0 h-[calc(100vh-68px)] lg:h-screen 
        w-64 bg-white border-r border-gray-200
        transform transition-all duration-300 z-40 lg:z-0
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0 opacity-100'}
        shadow-xl lg:shadow-sm overflow-y-auto
      `}>
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">
              Navigation
            </h2>
            <div className="h-1.5 w-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;

                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => {
                        onClose?.();
                      }}
                      onMouseEnter={() => setHoveredLink(link.path)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`
                        group flex items-center space-x-3 px-4 py-3 rounded-xl 
                        transition-all duration-300 cursor-pointer
                        ${isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-md'
                          : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent'
                        }
                      `}
                    >
                      <Icon 
                        size={20} 
                        className={`transition-all duration-300 flex-shrink-0 ${
                          isActive ? 'text-emerald-600' : 'text-gray-500 group-hover:text-emerald-600'
                        }`}
                      />
                      <span className="font-semibold text-sm flex-1">{link.name}</span>
                      {isActive && (
                        <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full shadow-sm flex-shrink-0"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Role Badge */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Role:</span>
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                user?.role === 'professor' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Bottom Status */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-xs text-gray-800 font-semibold text-center">
                EMSI Platform v2.0
              </p>
              <div className="flex items-center justify-center mt-3 space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg"></div>
                <span className="text-xs text-gray-700 font-medium">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;