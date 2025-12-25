import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaSpinner, FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      
      // Redirect based on role
      const role = response.data.role;
      switch (role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'professor':
          navigate('/professor/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          {/* Logo section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gray-50 rounded-2xl border border-gray-200 p-4">
              <img 
                src="/src/assets/logo/logo.jpg" 
                alt="EMSI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to access your EMSI portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                  focusedInput === 'email' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <FaUser className="text-lg" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput('')}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="your.email@emsi.ma"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                  focusedInput === 'password' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <FaLock className="text-lg" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('')}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In
                  <FaArrowRight className="ml-2" />
                </span>
              )}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Demo Credentials
            </p>
            <div className="text-xs text-gray-600 space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                <span className="flex items-center font-medium">
                  <FaUser className="mr-2 text-blue-600" />
                  Student
                </span>
                <span className="text-gray-500">student@emsi.ma</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                <span className="flex items-center font-medium">
                  <FaUser className="mr-2 text-purple-600" />
                  Professor
                </span>
                <span className="text-gray-500">professor@emsi.ma</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                <span className="flex items-center font-medium">
                  <FaUser className="mr-2 text-red-600" />
                  Admin
                </span>
                <span className="text-gray-500">admin@emsi.ma</span>
              </div>
              <p className="text-center text-gray-500 pt-2 border-t border-gray-200">
                Password: password123
              </p>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2024 EMSI Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;