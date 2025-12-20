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
  FaFileAlt,
  FaUpload
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
    { name: 'Users', path: '/admin/users', icon: FaUsers },
    { name: 'Students', path: '/admin/students', icon: FaGraduationCap },
    { name: 'Professors', path: '/admin/professors', icon: FaChalkboardTeacher },
    { name: 'Modules', path: '/admin/modules', icon: FaBook },
    { name: 'Levels', path: '/admin/levels', icon: FaCog },
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
    <div className="w-64 bg-gray-900 min-h-screen text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Navigation</h2>
        <nav>
          <ul className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;