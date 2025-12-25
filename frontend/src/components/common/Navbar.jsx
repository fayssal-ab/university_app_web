// ========================================
// Navbar.jsx - Premium Enhanced Version
// Path: src/components/common/Navbar.jsx
// ========================================
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBell, 
  FaSignOutAlt, 
  FaChevronDown, 
  FaBars, 
  FaTimes, 
  FaClock,
  FaUserCircle,
  FaCog,
  FaUserEdit
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';

const Navbar = ({ onMenuToggle, menuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [time, setTime] = useState(new Date());
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
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

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Top Bar with Social Icons */}
      <div className="bg-emerald-600 text-white py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-full flex items-center justify-start gap-6">
          {/* Social Icons */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
            <FaUserCircle size={20} className="text-white" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Premium Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-40 shadow-lg shadow-gray-100/50">
        <div className="max-w-full px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Left - Logo & Brand */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={() => onMenuToggle?.(!menuOpen)}
                className="lg:hidden p-2.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 active:scale-95 group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/20 rounded-xl transition-all duration-300"></div>
                {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>

              <Link 
                to={getDashboardLink()} 
                className="flex items-center group"
              >
<div className="relative w-32 h-32 lg:w-40 lg:h-40">
  <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
    <img 
      src="/src/assets/logo/logo.jpg" 
      alt="EMSI Logo" 
      className="w-full h-full object-contain drop-shadow-lg"
    />
  </div>
</div>
              </Link>
            </div>

            {/* Right - Notifications & User */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              {/* Notifications */}
              <button className="relative p-2.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 active:scale-95 group">
                <div className="relative">
                  <FaBell size={22} className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg animate-pulse">
                    3
                  </span>
                </div>
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-2xl hover:bg-emerald-50 transition-all duration-300 border border-gray-200 hover:border-emerald-300 hover:shadow-md group"
                >
                  <div className="relative">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {user?.firstName} {user?.lastName?.[0]}.
                    </p>
                    <p className="text-xs text-gray-500 font-medium">{user?.role}</p>
                  </div>
                  <FaChevronDown className={`text-gray-500 text-xs transition-all duration-300 hidden sm:block ${showDropdown ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                    {/* Background effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                    
                    {/* User Info */}
                    <div className="px-4 py-5 border-b border-gray-100">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-md"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-gray-900 truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                          <p className="text-xs text-gray-500 mt-1">Last login: Today</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${getRoleBadgeColor(user?.role)}`}>
                          {user?.role?.toUpperCase()}
                        </span>
                        <button className="text-xs text-gray-600 hover:text-emerald-600 flex items-center gap-1">
                          <FaCog size={12} />
                          Settings
                        </button>
                      </div>
                    </div>
                    
                    {/* Dropdown Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 mx-2 group"
                      >
                        <FaUserEdit className="mr-3 text-gray-500 group-hover:text-emerald-600" size={16} />
                        Edit Profile
                      </Link>
                      
                      <Link
                        to="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 mx-2 group"
                      >
                        <FaCog className="mr-3 text-gray-500 group-hover:text-emerald-600" size={16} />
                        Account Settings
                      </Link>
                    </div>
                    
                    {/* Sign Out Button */}
                    <div className="px-2 py-2 border-t border-gray-100 mt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 group"
                      >
                        <FaSignOutAlt className="mr-3 group-hover:rotate-180 transition-transform duration-300" size={16} />
                        Sign Out
                      </button>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        EMSI Platform v2.0 • Secure Session
                      </p>
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