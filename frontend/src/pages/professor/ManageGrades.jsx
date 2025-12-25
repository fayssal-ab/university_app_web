import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const ManageGrades = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [moduleId]);

  const fetchData = async () => {
    try {
      const response = await professorService.getModuleStudents(moduleId);
      const module = response.data.module;
      const studentsList = response.data.students;

      setModuleData(module);
      setStudents(studentsList);

      // Initialize grades object with existing grades
      const gradesObj = {};
      studentsList.forEach(student => {
        const finalGrade = student.grades?.find(g => g.gradeType === 'final');
        gradesObj[student._id] = {
          value: finalGrade?.value || '',
          comments: finalGrade?.comments || ''
        };
      });
      setGrades(gradesObj);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (studentId, field, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveGrade = async (studentId) => {
    const gradeData = grades[studentId];
    
    if (!gradeData.value || gradeData.value === '') {
      alert('Please enter a grade value');
      return;
    }

    const value = parseFloat(gradeData.value);
    if (isNaN(value) || value < 0 || value > 20) {
      alert('Grade must be between 0 and 20');
      return;
    }

    try {
      await professorService.addGrade({
        studentId,
        moduleId,
        value,
        semester: moduleData.semester,
        academicYear: moduleData.academicYear,
        gradeType: 'final',
        comments: gradeData.comments
      });

      alert('Grade saved successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    let successCount = 0;
    let errorCount = 0;

    for (const studentId in grades) {
      const gradeData = grades[studentId];
      
      // Skip if no value entered
      if (!gradeData.value || gradeData.value === '') {
        continue;
      }

      const value = parseFloat(gradeData.value);
      if (isNaN(value) || value < 0 || value > 20) {
        errorCount++;
        continue;
      }

      try {
        await professorService.addGrade({
          studentId,
          moduleId,
          value,
          semester: moduleData.semester,
          academicYear: moduleData.academicYear,
          gradeType: 'final',
          comments: gradeData.comments
        });
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Error saving grade for student ${studentId}:`, error);
      }
    }

    setSaving(false);
    alert(`Saved ${successCount} grades. ${errorCount} errors.`);
    fetchData(); // Refresh data
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <button
                  onClick={() => navigate(`/professor/modules/${moduleId}/manage`)}
                  className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Module
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manage Grades: {moduleData?.name}
                </h1>
                <p className="text-gray-500 mt-1">
                  {moduleData?.code} • Semester {moduleData?.semester} • {moduleData?.academicYear}
                </p>
              </div>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <FaSave />
                <span>{saving ? 'Saving All...' : 'Save All Grades'}</span>
              </button>
            </div>

            {/* Instructions */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-xl">ℹ️</div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Instructions</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Enter grades between 0 and 20</li>
                    <li>• Grades are saved as "Not Validated" - Admin will validate them later</li>
                    <li>• You can add optional comments for each grade</li>
                    <li>• Click "Save" for individual grades or "Save All" to save all at once</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Grades Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Grade (0-20)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Comments
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
                    {students.map((student) => {
                      const existingGrade = student.grades?.find(g => g.gradeType === 'final');
                      
                      return (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.user?.firstName} {student.user?.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              max="20"
                              value={grades[student._id]?.value || ''}
                              onChange={(e) => handleGradeChange(student._id, 'value', e.target.value)}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="0-20"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={grades[student._id]?.comments || ''}
                              onChange={(e) => handleGradeChange(student._id, 'comments', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Optional comments..."
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {existingGrade ? (
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                existingGrade.validated
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {existingGrade.validated ? 'Validated' : 'Pending Validation'}
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                Not Graded
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleSaveGrade(student._id)}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {students.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No students enrolled in this module</p>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageGrades;