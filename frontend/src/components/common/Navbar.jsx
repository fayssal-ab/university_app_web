import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

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
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'professor':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'admin':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <img 
                  src="/src/assets/logo/logo.jpg" 
                  alt="EMSI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800">
                  EMSI
                </span>
                <span className="text-xs text-gray-500">Platform</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <FaBell size={20} />
              <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                3
              </span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 pr-3 rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
              >
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 font-semibold border border-gray-200">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <FaChevronDown className={`text-gray-400 text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 font-bold text-lg border border-gray-200">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getRoleBadgeColor(user?.role)}`}>
                        {user?.role?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="px-2 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FaSignOutAlt className="mr-3" size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;