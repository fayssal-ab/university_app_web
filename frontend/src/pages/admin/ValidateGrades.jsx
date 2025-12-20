import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaCheckCircle } from 'react-icons/fa';

const ValidateGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await adminService.getAllGrades();
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Validate Grades</h1>

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
                    {grades.map((grade) => (
                      <tr key={grade._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {grade.student?.user?.firstName} {grade.student?.user?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {grade.module?.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                          {grade.value}/20
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {grade.validated ? (
                            <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                              Validated
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {!grade.validated && (
                            <button
                              onClick={() => handleValidate(grade._id)}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                            >
                              <FaCheckCircle />
                              <span>Validate</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
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