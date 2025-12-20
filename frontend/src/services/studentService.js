import API from './api';

const studentService = {
  // Get dashboard
  getDashboard: async () => {
    const response = await API.get('/student/dashboard');
    return response.data;
  },

  // Get enrolled modules
  getModules: async () => {
    const response = await API.get('/student/modules');
    return response.data;
  },

  // Get module details
  getModuleDetails: async (moduleId) => {
    const response = await API.get(`/student/modules/${moduleId}`);
    return response.data;
  },

  // Get assignments
  getAssignments: async () => {
    const response = await API.get('/student/assignments');
    return response.data;
  },

  // Submit assignment
  submitAssignment: async (assignmentId, file) => {
    const formData = new FormData();
    formData.append('submission', file);

    const response = await API.post(`/student/submit/${assignmentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get submissions
  getSubmissions: async () => {
    const response = await API.get('/student/submissions');
    return response.data;
  },

  // Get grades
  getGrades: async () => {
    const response = await API.get('/student/grades');
    return response.data;
  },

  // Get notifications
  getNotifications: async () => {
    const response = await API.get('/student/notifications');
    return response.data;
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    const response = await API.patch(`/student/notifications/${notificationId}`);
    return response.data;
  }
};

export default studentService;