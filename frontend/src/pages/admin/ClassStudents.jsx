import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEnvelope, FaUser } from 'react-icons/fa';

const ClassStudents = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [levelInfo, setLevelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [levelId, selectedField]);

  const fetchStudents = async () => {
    try {
      const response = await adminService.getStudentsByLevel(levelId);

// response راه array مباشرة
setStudents(Array.isArray(response) ? response : []);

      
      if (response.length > 0 && response[0].level) {
  setLevelInfo(response[0].level);
}

    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminService.deleteStudent(studentId);
        alert('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  // Get unique fields from students
  const fields = [...new Set(students.map(s => s.field))].filter(Boolean);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => navigate('/admin/classes')}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
              >
                <FaArrowLeft className="mr-2" />
                Back to Classes
              </button>
              
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {levelInfo?.name || 'Class'} Students
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {students.length} student{students.length !== 1 ? 's' : ''} enrolled
                  </p>
                </div>
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => navigate('/admin/students/add')}
                >
                  <FaPlus />
                  <span>Add Student</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            {fields.length > 1 && (
              <Card className="mb-6">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Filter by Field:</label>
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Fields</option>
                    {fields.map((field, index) => (
                      <option key={index} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
              </Card>
            )}

            {/* Students List */}
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Field
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Semester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Modules
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <FaUser className="text-gray-400 text-4xl mb-3" />
                            <p className="text-gray-500">No students found in this class</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold">
                                {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.user?.firstName} {student.user?.lastName}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <FaEnvelope className="mr-1" />
                                  {student.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.field}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Semester {student.semester}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                              {student.enrolledModules?.length || 0} modules
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.user?.isActive ? (
                              <span className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                                Active
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                            <button
                              onClick={() => navigate(`/admin/students/${student._id}/edit`)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(student._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassStudents;