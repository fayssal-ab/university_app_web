import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaArrowLeft, FaUser, FaEnvelope, FaIdCard, FaGraduationCap, FaBook } from 'react-icons/fa';

const EditStudent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);
  const [levels, setLevels] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    branch: '',
    level: '',
    academicYear: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [studentId]);

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
      const [branchesRes, levelsRes, studentsRes] = await Promise.all([
        adminService.getAllBranches(),
        adminService.getAllLevels(),
        adminService.getAllStudents()
      ]);
      
      setBranches(Array.isArray(branchesRes) ? branchesRes : []);
      setLevels(Array.isArray(levelsRes.data) ? levelsRes.data : []);

      // Find the student
      const studentData = studentsRes.data.find(s => s._id === studentId);
      if (!studentData) {
        alert('Student not found');
        navigate('/admin/classes');
        return;
      }

      setStudent(studentData);
      setFormData({
        firstName: studentData.user?.firstName || '',
        lastName: studentData.user?.lastName || '',
        email: studentData.user?.email || '',
        branch: studentData.level?.branch?._id || '',
        level: studentData.level?._id || '',
        academicYear: studentData.academicYear || '',
        phoneNumber: studentData.phoneNumber || '',
        dateOfBirth: studentData.dateOfBirth ? studentData.dateOfBirth.split('T')[0] : '',
        address: studentData.address || ''
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'branch') {
      setFormData(prev => ({
        ...prev,
        level: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
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

    setSaving(true);

    try {
      await adminService.updateStudent(studentId, formData);
      alert('Student updated successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error updating student:', error);
      const errorMsg = error.response?.data?.error || 'Failed to update student';
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate(-1);
    }
  };

  if (loading) return <Loader />;

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
              
              <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
              <p className="text-gray-600 mt-2">Update student information</p>
            </div>

            {/* Form */}
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
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
                        Student ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={student?.studentId || ''}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed uppercase"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Student ID cannot be changed</p>
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
                            {level.name} ({level.shortName})
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
                    type="submit"
                    disabled={saving}
                    className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium transition ${
                      saving 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-blue-700'
                    }`}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditStudent;