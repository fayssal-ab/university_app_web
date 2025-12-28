import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBell, 
  FaSignOutAlt, 
  FaChevronDown, 
  FaBars, 
  FaTimes, 
  FaUserCircle,
  FaCog,
  FaUserEdit,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import studentService from '../../services/studentService';

const Navbar = ({ onMenuToggle, menuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await studentService.getNotifications();
      if (response && response.data) {
        setNotifications(response.data.slice(0, 5));
        const unread = response.data.filter(n => !n.read).length || 0;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notifId, e) => {
    e.stopPropagation();
    try {
      await studentService.markNotificationRead(notifId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteNotification = async (notifId, e) => {
    e.stopPropagation();
    try {
      await studentService.deleteNotification(notifId);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'student':
        return '/student/dashboard';
      case 'professor':
        return '/professor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'student':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md';
      case 'professor':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md';
      case 'admin':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'announcement':
        return '📢';
      case 'grade':
        return '📊';
      case 'assignment':
        return '📝';
      default:
        return '📌';
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-emerald-600 text-white py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-full flex items-center justify-start gap-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
            <FaUserCircle size={20} className="text-white" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-40 shadow-lg">
        <div className="max-w-full px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={() => onMenuToggle?.(!menuOpen)}
                className="lg:hidden p-2.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              >
                {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>

              <Link to={getDashboardLink()} className="flex items-center group">
                <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                  <img 
                    src="/src/assets/logo/logo.jpg" 
                    alt="EMSI Logo" 
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Notifications Dropdown - Student Only */}
              {user?.role === 'student' && (
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                  >
                    <FaBell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border z-50">
                      <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <Link 
                          to="/student/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <FaEye size={12} />
                          View All
                        </Link>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <FaBell className="mx-auto text-gray-300 text-3xl mb-2" />
                            <p className="text-gray-500 text-sm">No notifications</p>
                          </div>
                        ) : (
                          <div className="divide-y">
                            {notifications.map((notif) => (
                              <div
                                key={notif._id}
                                className={`p-3 hover:bg-gray-50 transition ${
                                  !notif.read ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl flex-shrink-0">
                                    {getNotificationIcon(notif.type)}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                      {notif.title}
                                    </p>
                                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                      {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  {!notif.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-2 ml-7">
                                  {!notif.read && (
                                    <button
                                      onClick={(e) => handleMarkAsRead(notif._id, e)}
                                      className="text-xs text-blue-600 hover:text-blue-700"
                                      title="Mark as read"
                                    >
                                      ✓ Read
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => handleDeleteNotification(notif._id, e)}
                                    className="text-xs text-red-500 hover:text-red-700"
                                    title="Delete"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div className="p-3 border-t bg-gray-50">
                          <Link
                            to="/student/notifications"
                            onClick={() => setShowNotifications(false)}
                            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View All Notifications
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-emerald-50 transition border"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.firstName} {user?.lastName?.[0]}.
                    </p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                  <FaChevronDown className={`text-xs transition ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2">
                        <FaUserEdit />
                        Edit Profile
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2">
                        <FaCog />
                        Settings
                      </button>
                    </div>

                    <div className="p-2 border-t">
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center gap-2"
                      >
                        <FaSignOutAlt />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;