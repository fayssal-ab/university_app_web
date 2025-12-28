const User = require('../models/User');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public (Admin only in production)
const register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, ...otherData } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName
    });

    // Create role-specific profile
    if (role === 'student') {
      await Student.create({
        user: user._id,
        studentId: otherData.studentId,
        level: otherData.level,
        field: otherData.field,
        semester: otherData.semester,
        academicYear: otherData.academicYear
      });
    } else if (role === 'professor') {
      await Professor.create({
        user: user._id,
        professorId: otherData.professorId,
        department: otherData.department,
        specialization: otherData.specialization
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact admin.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let profileData = null;

    if (user.role === 'student') {
      profileData = await Student.findOne({ user: user._id })
        .populate('level')
        .populate('enrolledModules');
    } else if (user.role === 'professor') {
      profileData = await Professor.findOne({ user: user._id })
        .populate('assignedModules');
    }

    res.json({
      success: true,
      data: {
        user,
        profile: profileData
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, address, profilePicture } = req.body;

    console.log('========================================');
    console.log('📝 Update profile request received');
    console.log('User ID:', req.user._id);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('========================================');

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      console.error('❌ User not found:', req.user._id);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('✅ User found:', user.email, '- Role:', user.role);

    // Update basic user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
      console.log('📸 Updating profile picture (length):', profilePicture?.length || 0);
    }
    
    // Save user
    console.log('💾 Saving user...');
    await user.save();
    console.log('✅ User saved successfully');

    // Update role-specific profile (phoneNumber & address)
    try {
      if (user.role === 'student') {
        console.log('👨‍🎓 Looking for student profile...');
        const student = await Student.findOne({ user: user._id });
        
        if (student) {
          console.log('✅ Student found, updating...');
          if (phoneNumber !== undefined) student.phoneNumber = phoneNumber;
          if (address !== undefined) student.address = address;
          await student.save();
          console.log('✅ Student profile updated');
        } else {
          console.log('⚠️ Student profile not found, skipping...');
        }
      } else if (user.role === 'professor') {
        console.log('👨‍🏫 Looking for professor profile...');
        const professor = await Professor.findOne({ user: user._id });
        
        if (professor) {
          console.log('✅ Professor found, updating...');
          if (phoneNumber !== undefined) professor.phoneNumber = phoneNumber;
          if (address !== undefined) professor.address = address;
          await professor.save();
          console.log('✅ Professor profile updated');
        } else {
          console.log('⚠️ Professor profile not found, skipping...');
        }
      }
    } catch (profileError) {
      console.error('⚠️ Error updating role profile (non-critical):', profileError.message);
      // Continue anyway - basic profile was updated
    }

    const responseData = {
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture
    };

    console.log('✅ Profile update completed successfully');
    console.log('========================================');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: responseData
    });
  } catch (error) {
    console.error('========================================');
    console.error('❌ CRITICAL UPDATE PROFILE ERROR');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    console.error('Full error:', error);
    console.error('========================================');
    
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while updating profile'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  updatePassword,
  updateProfile
};