import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ValidateGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await adminService.getAllGrades();
      setGrades(response.data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (gradeId) => {
    try {
      await adminService.validateGrade(gradeId);
      alert('Grade validated successfully!');
      fetchGrades();
    } catch (error) {
      console.error('Error validating grade:', error);
      alert('Failed to validate grade');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Validate Grades</h1>
              <p className="text-gray-600 mt-2">Review and validate grades submitted by professors</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-yellow-50 border-yellow-200">
                <div className="text-center">
                  <p className="text-sm text-yellow-800 font-medium">Pending Validation</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-2">
                    {grades.filter(g => !g.validated).length}
                  </p>
                </div>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <div className="text-center">
                  <p className="text-sm text-green-800 font-medium">Validated</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {grades.filter(g => g.validated).length}
                  </p>
                </div>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-blue-800 font-medium">Total Grades</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {grades.length}
                  </p>
                </div>
              </Card>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {grades.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <p className="text-gray-500">No grades to validate</p>
                        </td>
                      </tr>
                    ) : (
                      grades.map((grade) => (
                        <tr key={grade._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {grade.student?.user?.firstName} {grade.student?.user?.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {grade.module?.code} - {grade.module?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                            {grade.value}/20
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {grade.validated ? (
                              <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full flex items-center w-fit">
                                <FaCheckCircle className="mr-1" />
                                Validated
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full flex items-center w-fit">
                                <FaTimesCircle className="mr-1" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {!grade.validated && (
                              <button
                                onClick={() => handleValidate(grade._id)}
                                className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                              >
                                <FaCheckCircle />
                                <span>Validate</span>
                              </button>
                            )}
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

export default ValidateGrades;