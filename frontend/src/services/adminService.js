import api from './api';

const adminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // ==================== BRANCHES ====================
  getAllBranches: async () => {
    const response = await api.get('/admin/branches');
    return response.data;
  },
  createBranch: async (data) => {
    const response = await api.post('/admin/branches', data);
    return response.data;
  },
  updateBranch: async (id, data) => {
    const response = await api.put(`/admin/branches/${id}`, data);
    return response.data;
  },
  deleteBranch: async (id) => {
    const response = await api.delete(`/admin/branches/${id}`);
    return response.data;
  },

  // ==================== PROFESSORS ====================
  getAllProfessors: async () => {
    const response = await api.get('/admin/professors');
    return response.data;
  },
  createProfessor: async (data) => {
    const response = await api.post('/admin/professors', data);
    return response.data;
  },
  updateProfessor: async (id, data) => {
    const response = await api.put(`/admin/professors/${id}`, data);
    return response.data;
  },
  deleteProfessor: async (id) => {
    const response = await api.delete(`/admin/professors/${id}`);
    return response.data;
  },
  assignProfessor: async (id, moduleIds) => {
    const response = await api.post(`/admin/professors/${id}/assign`, { moduleIds });
    return response.data;
  },

  // ==================== LEVELS (CLASSES) ====================
  getAllLevels: async () => {
    const response = await api.get('/admin/levels');
    return response.data;
  },
  createLevel: async (data) => {
    const response = await api.post('/admin/levels', data);
    return response.data;
  },
  updateLevel: async (id, data) => {
    const response = await api.put(`/admin/levels/${id}`, data);
    return response.data;
  },
  deleteLevel: async (id) => {
    const response = await api.delete(`/admin/levels/${id}`);
    return response.data;
  },
  getStudentsByLevel: async (levelId, field = '') => {
    const params = field ? `?field=${encodeURIComponent(field)}` : '';
    const response = await api.get(`/admin/levels/${levelId}/students${params}`);
    return response.data;
  },

  // ==================== STUDENTS ====================
  getAllStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },
  createStudent: async (data) => {
    const response = await api.post('/admin/students', data);
    return response.data;
  },
  updateStudent: async (id, data) => {
    const response = await api.put(`/admin/students/${id}`, data);
    return response.data;
  },
  deleteStudent: async (id) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },
  enrollStudent: async (id, moduleIds) => {
    const response = await api.post(`/admin/students/${id}/enroll`, { moduleIds });
    return response.data;
  },

  // ==================== MODULES ====================
  getAllModules: async () => {
    const response = await api.get('/admin/modules');
    return response.data;
  },
  createModule: async (data) => {
    const response = await api.post('/admin/modules', data);
    return response.data;
  },
  updateModule: async (id, data) => {
    const response = await api.put(`/admin/modules/${id}`, data);
    return response.data;
  },
  deleteModule: async (id) => {
    const response = await api.delete(`/admin/modules/${id}`);
    return response.data;
  },

  // ==================== GRADES ====================
  getAllGrades: async () => {
    const response = await api.get('/admin/grades');
    return response.data;
  },
  validateGrade: async (id) => {
    const response = await api.patch(`/admin/grades/${id}/validate`);
    return response.data;
  },
};

export default adminService;