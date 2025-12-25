import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaBook,
  FaTasks,
  FaGraduationCap,
  FaBell,
  FaUsers,
  FaChalkboardTeacher,
  FaCog,
  FaFileAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: FaHome },
    { name: 'My Modules', path: '/student/modules', icon: FaBook },
    { name: 'Assignments', path: '/student/assignments', icon: FaTasks },
    { name: 'Grades', path: '/student/grades', icon: FaGraduationCap },
    { name: 'Notifications', path: '/student/notifications', icon: FaBell }
  ];

  const professorLinks = [
    { name: 'Dashboard', path: '/professor/dashboard', icon: FaHome },
    { name: 'My Modules', path: '/professor/modules', icon: FaBook },
    { name: 'Create Assignment', path: '/professor/assignments/create', icon: FaTasks },
    { name: 'Announcements', path: '/professor/announcements', icon: FaBell }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
      { name: 'Branches', path: '/admin/branches', icon: FaBook }, // 👈 جديد
    { name: 'Classes', path: '/admin/classes', icon: FaGraduationCap },
    { name: 'Professors', path: '/admin/professors', icon: FaChalkboardTeacher },
    { name: 'Modules', path: '/admin/modules', icon: FaBook },
    { name: 'Grades', path: '/admin/grades', icon: FaFileAlt }
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'student':
        return studentLinks;
      case 'professor':
        return professorLinks;
      case 'admin':
        return adminLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className="w-64 bg-white min-h-screen border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">
            Navigation
          </h2>
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`transition-all ${
                        isActive ? '' : 'group-hover:scale-110'
                      }`}
                    />
                    <span className="font-medium">{link.name}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom info */}
        <div className="mt-12 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 text-center font-medium">
            EMSI Platform v2.0
          </p>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;