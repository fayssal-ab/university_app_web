import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBell, 
  FaSignOutAlt, 
  FaChevronDown, 
  FaBars, 
  FaTimes,
  FaCog,
  FaUserEdit,
  FaEye,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserShield,
  FaEnvelope,
  FaPhone
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

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <FaGraduationCap className="text-emerald-600" />;
      case 'professor':
        return <FaChalkboardTeacher className="text-emerald-600" />;
      case 'admin':
        return <FaUserShield className="text-emerald-600" />;
      default:
        return null;
    }
  };

  // Component pour afficher l'avatar de l'utilisateur
  const UserAvatar = ({ size = 'default', showBorder = false, showStatus = false }) => {
    const sizeClasses = {
      small: 'w-10 h-10 text-sm',
      default: 'w-11 h-11 text-base',
      large: 'w-20 h-20 text-2xl'
    };

    const borderClass = showBorder ? 'ring-4 ring-white ring-offset-2 ring-offset-emerald-100' : '';

    return (
      <div className="relative">
        {user?.profilePicture ? (
          <img 
            src={user.profilePicture} 
            alt={`${user.firstName} ${user.lastName}`}
            className={`${sizeClasses[size]} rounded-2xl object-cover shadow-lg ${borderClass}`}
          />
        ) : (
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg ${borderClass}`}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        )}
        {showStatus && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Top Bar - EMSI Colors */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 text-white py-3 px-4 sm:px-6 lg:px-8 shadow-lg relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-full flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative"
              >
                <div className="absolute inset-0 bg-white/20 rounded-lg blur group-hover:blur-xl transition-all"></div>
                <svg className="w-5 h-5 fill-white relative z-10 group-hover:scale-125 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative"
              >
                <div className="absolute inset-0 bg-white/20 rounded-lg blur group-hover:blur-xl transition-all"></div>
                <svg className="w-5 h-5 fill-white relative z-10 group-hover:scale-125 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative"
              >
                <div className="absolute inset-0 bg-white/20 rounded-lg blur group-hover:blur-xl transition-all"></div>
                <svg className="w-5 h-5 fill-white relative z-10 group-hover:scale-125 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>

            {/* Info Text */}
            <div className="hidden md:flex items-center gap-2 text-white/90 text-sm font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>EMSI School Management System</span>
            </div>
          </div>

          {/* Right Side Info */}
          <div className="hidden lg:flex items-center gap-4 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <FaEnvelope className="w-4 h-4" />
              <span>contact@emsi.ma</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <div className="flex items-center gap-2">
              <FaPhone className="w-4 h-4" />
              <span>+212 5XX-XXXXXX</span>
            </div>
          </div>
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
                    className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
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
                    className="relative p-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-2xl transition-all group"
                  >
                    <FaBell size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-6 h-6 text-xs font-bold text-white bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaBell className="text-xl" />
                          <h3 className="font-bold text-lg">Notifications</h3>
                        </div>
                        <Link 
                          to="/student/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors backdrop-blur-sm"
                        >
                          <FaEye size={12} />
                          View All
                        </Link>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                              <FaBell className="text-gray-300 text-3xl" />
                            </div>
                            <p className="text-gray-500 font-medium">No notifications yet</p>
                            <p className="text-gray-400 text-sm mt-1">We'll notify you when something arrives!</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {notifications.map((notif) => (
                              <div
                                key={notif._id}
                                className={`p-4 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all ${
                                  !notif.read ? 'bg-emerald-50/50' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                                    {getNotificationIcon(notif.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="text-sm font-bold text-gray-900">
                                        {notif.title}
                                      </p>
                                      {!notif.read && (
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0 mt-1 shadow-lg shadow-emerald-500/50"></div>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2 mt-1.5">
                                      {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-3 ml-13">
                                  {!notif.read && (
                                    <button
                                      onClick={(e) => handleMarkAsRead(notif._id, e)}
                                      className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                                    >
                                      ✓ Mark as read
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => handleDeleteNotification(notif._id, e)}
                                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                                    >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Dropdown - EMSI Colors */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all border border-gray-200 hover:border-emerald-300 hover:shadow-lg group"
                >
                  <UserAvatar size="small" showStatus />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {user?.firstName} {user?.lastName?.[0]}.
                    </p>
                    <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                      {getRoleIcon(user?.role)}
                      {user?.role}
                    </p>
                  </div>
                  <FaChevronDown className={`text-xs text-gray-400 transition-all duration-300 ${showDropdown ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slideDown">
                    {/* Header with EMSI Green Gradient */}
                    <div className="relative p-6 bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-700 text-white overflow-hidden">
                      {/* Animated Background */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
                      </div>
                      
                      <div className="relative z-10 flex items-center gap-4">
                        <UserAvatar size="large" showBorder />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xl truncate mb-1">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                            <FaEnvelope className="w-3.5 h-3.5" />
                            <p className="truncate">{user?.email}</p>
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                            {getRoleIcon(user?.role)}
                            <span className="capitalize text-white">{user?.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items with EMSI Colors */}
                    <div className="p-3">
                      <Link 
                        to="/profile" 
                        onClick={() => setShowDropdown(false)}
                        className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 mb-1"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <FaUserEdit className="text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">My Profile</p>
                          <p className="text-xs text-gray-500">View and edit your profile</p>
                        </div>
                        <FaChevronDown className="-rotate-90 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </Link>

                      <Link 
                        to="/settings" 
                        onClick={() => setShowDropdown(false)}
                        className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <FaCog className="text-lg group-hover:rotate-90 transition-transform duration-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">Settings</p>
                          <p className="text-xs text-gray-500">Manage your preferences</p>
                        </div>
                        <FaChevronDown className="-rotate-90 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full group flex items-center justify-center gap-3 px-4 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                      >
                        <FaSignOutAlt className="text-lg group-hover:translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;