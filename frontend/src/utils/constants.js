export const ROLES = {
  STUDENT: 'student',
  PROFESSOR: 'professor',
  ADMIN: 'admin'
};

export const NOTIFICATION_TYPES = {
  ANNOUNCEMENT: 'announcement',
  GRADE: 'grade',
  ASSIGNMENT: 'assignment',
  SUBMISSION: 'submission',
  GENERAL: 'general',
  SYSTEM: 'system'
};

export const GRADE_STATUS = {
  PENDING: 'pending',
  GRADED: 'graded',
  LATE: 'late'
};

export const API_BASE_URL = 'http://localhost:5000';

export const FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PPT: 'application/vnd.ms-powerpoint',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
};

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB