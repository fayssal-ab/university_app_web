// Authorize based on user role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Check if user is student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Student role required.'
    });
  }
  next();
};

// Check if user is professor
const isProfessor = (req, res, next) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Professor role required.'
    });
  }
  next();
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin role required.'
    });
  }
  next();
};

module.exports = {
  authorize,
  isStudent,
  isProfessor,
  isAdmin
};