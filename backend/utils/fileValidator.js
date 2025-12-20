// Allowed file types
const allowedTypes = {
  image: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ],
  assignment: [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

// Max file sizes (in bytes)
const maxSizes = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  assignment: 20 * 1024 * 1024 // 20MB
};

// Validate file type
const validateFileType = (file, category = 'document') => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const allowedTypesForCategory = allowedTypes[category];
  
  if (!allowedTypesForCategory.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypesForCategory.join(', ')}`
    };
  }

  const maxSize = maxSizes[category];
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`
    };
  }

  return { valid: true };
};

// Sanitize filename
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

// Generate unique filename
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(`.${extension}`, '');
  const sanitized = sanitizeFilename(nameWithoutExt);
  
  return `${sanitized}-${timestamp}-${random}.${extension}`;
};

module.exports = {
  validateFileType,
  sanitizeFilename,
  generateUniqueFilename,
  allowedTypes,
  maxSizes
};
