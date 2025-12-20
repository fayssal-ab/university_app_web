const multer = require('multer');
const path = require('path');
const { validateFileType, generateUniqueFilename } = require('../utils/fileValidator');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on file field
    if (file.fieldname === 'profilePicture') {
      uploadPath += 'profile-pics/';
    } else if (file.fieldname === 'material' || file.fieldname === 'materials') {
      uploadPath += 'materials/';
    } else if (file.fieldname === 'submission' || file.fieldname === 'assignment') {
      uploadPath += 'submissions/';
    } else {
      uploadPath += 'others/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = generateUniqueFilename(file.originalname);
    cb(null, uniqueFilename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  let category = 'document';
  
  if (file.fieldname === 'profilePicture') {
    category = 'image';
  } else if (file.fieldname === 'submission' || file.fieldname === 'assignment') {
    category = 'assignment';
  }
  
  const validation = validateFileType(file, category);
  
  if (!validation.valid) {
    return cb(new Error(validation.error), false);
  }
  
  cb(null, true);
};

// Multer upload configurations
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB max
  }
});

// Upload single file
const uploadSingle = (fieldName) => upload.single(fieldName);

// Upload multiple files
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Upload mixed files
const uploadFields = (fields) => upload.fields(fields);

// Error handler for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 20MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files uploaded'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError
};