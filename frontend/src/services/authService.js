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

  // Update profile (FIXED)
  updateProfile: async (profileData) => {
    try {
      const response = await API.put('/auth/updateprofile', profileData);
      
      if (response.data.success) {
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Merge updated data
        const updatedUser = {
          ...currentUser,
          ...response.data.data
        };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile service error:', error);
      throw error;
    }
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