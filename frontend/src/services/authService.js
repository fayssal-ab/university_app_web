import API from './api';

const authService = {
  // Login
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await API.put('/auth/updatepassword', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Get stored user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;