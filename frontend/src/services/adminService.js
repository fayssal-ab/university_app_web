import API from './api';

const adminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await API.get('/admin/dashboard');
    return response.data;
  },

  // Users
  getAllUsers: async () => {
    const response = await API.get('/admin/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await API.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await API.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Students
  getAllStudents: async () => {
    const response = await API.get('/admin/students');
    return response.data;
  },

  enrollStudent: async (studentId, moduleIds) => {
    const response = await API.post(`/admin/students/${studentId}/enroll`, {
      moduleIds
    });
    return response.data;
  },

  // Professors
  getAllProfessors: async () => {
    const response = await API.get('/admin/professors');
    return response.data;
  },

  assignProfessor: async (professorId, moduleIds) => {
    const response = await API.post(`/admin/professors/${professorId}/assign`, {
      moduleIds
    });
    return response.data;
  },

  // Modules
  getAllModules: async () => {
    const response = await API.get('/admin/modules');
    return response.data;
  },

  createModule: async (moduleData) => {
    const response = await API.post('/admin/modules', moduleData);
    return response.data;
  },

  updateModule: async (moduleId, moduleData) => {
    const response = await API.put(`/admin/modules/${moduleId}`, moduleData);
    return response.data;
  },

  deleteModule: async (moduleId) => {
    const response = await API.delete(`/admin/modules/${moduleId}`);
    return response.data;
  },

  // Levels
  getAllLevels: async () => {
    const response = await API.get('/admin/levels');
    return response.data;
  },

  createLevel: async (levelData) => {
    const response = await API.post('/admin/levels', levelData);
    return response.data;
  },

  // Grades
  getAllGrades: async () => {
    const response = await API.get('/admin/grades');
    return response.data;
  },

  validateGrade: async (gradeId) => {
    const response = await API.patch(`/admin/grades/${gradeId}/validate`);
    return response.data;
  }
};

export default adminService;