import API from './api';

const professorService = {
  // Get dashboard
  getDashboard: async () => {
    const response = await API.get('/professor/dashboard');
    return response.data;
  },

  // Get assigned modules
  getModules: async () => {
    const response = await API.get('/professor/modules');
    return response.data;
  },

  // Upload material
  uploadMaterial: async (moduleId, title, description, file) => {
    const formData = new FormData();
    formData.append('moduleId', moduleId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('material', file);

    const response = await API.post('/professor/materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Create assignment
  createAssignment: async (assignmentData) => {
    const response = await API.post('/professor/assignments', assignmentData);
    return response.data;
  },

  // Get submissions
  getSubmissions: async (assignmentId) => {
    const response = await API.get(`/professor/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  // Grade submission
  gradeSubmission: async (submissionId, grade, feedback) => {
    const response = await API.post(`/professor/grade/${submissionId}`, {
      grade,
      feedback
    });
    return response.data;
  },

  // Send announcement
  sendAnnouncement: async (moduleId, title, message) => {
    const response = await API.post('/professor/announcements', {
      moduleId,
      title,
      message
    });
    return response.data;
  },

  // Get students in module
  getStudents: async (moduleId) => {
    const response = await API.get(`/professor/students/${moduleId}`);
    return response.data;
  }
};

export default professorService;