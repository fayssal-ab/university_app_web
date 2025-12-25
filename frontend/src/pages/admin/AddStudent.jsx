import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaArrowLeft, FaUser, FaEnvelope, FaLock, FaIdCard, FaGraduationCap, FaBook } from 'react-icons/fa';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [levels, setLevels] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [formData, setFormData] = useState({
    // User Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // Student Info
    studentId: '',
    branch: '',
    level: '',
    academicYear: '2024-2025',
    phoneNumber: '',
    dateOfBirth: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

useEffect(() => {
  if (formData.branch) {
    const filtered = levels.filter(level =>
      level.branch?._id === formData.branch
    );
    setFilteredLevels(filtered);
  } else {
    setFilteredLevels([]);
  }
}, [formData.branch, levels]);


  const fetchData = async () => {
    try {
      const [branchesRes, levelsRes] = await Promise.all([
        adminService.getAllBranches(),
        adminService.getAllLevels()
      ]);
      
setBranches(Array.isArray(branchesRes) ? branchesRes : []);
setLevels(Array.isArray(levelsRes.data) ? levelsRes.data : []);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset level when branch changes
    if (name === 'branch') {
      setFormData(prev => ({
        ...prev,
        level: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.level) newErrors.level = 'Class/Level is required';
    if (!formData.academicYear) newErrors.academicYear = 'Academic year is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await adminService.createStudent(formData);
      alert('Student created successfully!');
      navigate('/admin/classes');
    } catch (error) {
      console.error('Error creating student:', error);
      const errorMsg = error.response?.data?.error || 'Failed to create student';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All data will be lost.')) {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
              
              <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
              <p className="text-gray-600 mt-2">Fill in the information to create a new student account</p>
            </div>

            {/* Form */}
            <Card>
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="student@emsi.ma"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Min 6 characters"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Academic Information Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaGraduationCap className="mr-2 text-blue-600" />
                    Academic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student ID *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase ${
                            errors.studentId ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="STU2024001"
                        />
                      </div>
                      {errors.studentId && (
                        <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Year *
                      </label>
                      <input
                        type="text"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.academicYear ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="2024-2025"
                      />
                      {errors.academicYear && (
                        <p className="mt-1 text-sm text-red-600">{errors.academicYear}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch/Field *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBook className="text-gray-400" />
                        </div>
                        <select
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.branch ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Branch</option>
                          {branches.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                              {branch.name} ({branch.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.branch && (
                        <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class/Level *
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        disabled={!formData.branch}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          errors.level ? 'border-red-500' : 'border-gray-300'
                        } ${!formData.branch ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      >
                        <option value="">
                          {formData.branch ? 'Select Class/Level' : 'Select Branch First'}
                        </option>
                        {filteredLevels.map((level) => (
                          <option key={level._id} value={level._id}>
                            {level.name} ({level.shortName}) - Semester {level.semester}
                          </option>
                        ))}
                      </select>
                      {errors.level && (
                        <p className="mt-1 text-sm text-red-600">{errors.level}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Optional Information Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Information (Optional)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Enter student address"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium transition ${
                      loading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Creating...' : 'Create Student'}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddStudent;