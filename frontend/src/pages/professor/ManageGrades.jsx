import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaSave, FaArrowLeft, FaInfoCircle, FaCheckCircle, FaClock, FaUsers } from 'react-icons/fa';

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

      // Initialize grades object
      const gradesObj = {};
      studentsList.forEach(student => {
        const finalGrade = student.grades?.find(g => g.gradeType === 'final');
        gradesObj[student._id] = {
          value: finalGrade?.value || '',
          comments: finalGrade?.comments || '',
          validated: finalGrade?.validated || false
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

  const handleSaveAll = async () => {
    setSaving(true);
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const studentId in grades) {
      const gradeData = grades[studentId];
      
      // Skip if no value entered
      if (!gradeData.value || gradeData.value === '') {
        skippedCount++;
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
    
    let message = `✅ Saved ${successCount} grade(s)`;
    if (errorCount > 0) message += `\n⚠️ ${errorCount} error(s)`;
    if (skippedCount > 0) message += `\n⏭️ ${skippedCount} skipped (empty)`;
    message += '\n\n📋 All grades are pending admin validation.';
    
    alert(message);
    fetchData();
  };

  // Calculate statistics
  const totalStudents = students.length;
  const gradedCount = Object.values(grades).filter(g => g.value && g.value !== '').length;
  const validatedCount = students.filter(s => {
    const finalGrade = s.grades?.find(g => g.gradeType === 'final');
    return finalGrade?.validated;
  }).length;
  const pendingCount = gradedCount - validatedCount;

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
                onClick={() => navigate(`/professor/modules/${moduleId}/manage`)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition"
              >
                <FaArrowLeft className="mr-2" />
                Back to Module
              </button>
              
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Grade Class: {moduleData?.name}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {moduleData?.code} • {moduleData?.level?.name} • Semester {moduleData?.semester}
                  </p>
                </div>
                <button
                  onClick={handleSaveAll}
                  disabled={saving || gradedCount === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-semibold transition ${
                    saving || gradedCount === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <FaSave className="text-xl" />
                  <span>{saving ? 'Saving...' : `Save All Grades (${gradedCount})`}</span>
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaUsers className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Total Students</p>
                    <p className="text-2xl font-bold text-blue-900">{totalStudents}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaSave className="text-purple-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-800 font-medium">Graded</p>
                    <p className="text-2xl font-bold text-purple-900">{gradedCount}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <FaClock className="text-yellow-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaCheckCircle className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-green-800 font-medium">Validated</p>
                    <p className="text-2xl font-bold text-green-900">{validatedCount}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <FaInfoCircle className="text-blue-600 text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">Quick Guide</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Enter grades (0-20) directly in the table below</li>
                    <li>• Add optional comments for each student</li>
                    <li>• Click "Save All Grades" to submit all at once</li>
                    <li>• Grades await admin validation before students can see them</li>
                    <li>• ⚠️ You cannot edit validated grades (contact admin if needed)</li>
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade (0-20)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Comments
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => {
                      const existingGrade = student.grades?.find(g => g.gradeType === 'final');
                      const isValidated = existingGrade?.validated || false;
                      const gradeValue = grades[student._id]?.value || '';
                      
                      return (
                        <tr 
                          key={student._id} 
                          className={`hover:bg-gray-50 transition ${
                            isValidated ? 'bg-green-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.studentId}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs mr-2">
                                {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {student.user?.firstName} {student.user?.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              max="20"
                              value={gradeValue}
                              onChange={(e) => handleGradeChange(student._id, 'value', e.target.value)}
                              disabled={isValidated}
                              className={`w-20 px-2 py-1.5 border rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 transition ${
                                isValidated 
                                  ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
                                  : gradeValue 
                                    ? gradeValue >= 10 
                                      ? 'border-green-300 text-green-700 bg-green-50' 
                                      : 'border-red-300 text-red-700 bg-red-50'
                                    : 'border-gray-300'
                              }`}
                              placeholder="--"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={grades[student._id]?.comments || ''}
                              onChange={(e) => handleGradeChange(student._id, 'comments', e.target.value)}
                              disabled={isValidated}
                              className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition ${
                                isValidated ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                              }`}
                              placeholder="Optional comment..."
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {existingGrade ? (
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center w-fit ${
                                existingGrade.validated
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {existingGrade.validated ? (
                                  <>
                                    <FaCheckCircle className="mr-1" />
                                    Validated
                                  </>
                                ) : (
                                  <>
                                    <FaClock className="mr-1" />
                                    Pending
                                  </>
                                )}
                              </span>
                            ) : gradeValue ? (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                To Save
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                Not Graded
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {students.length === 0 && (
                <div className="text-center py-12">
                  <FaUsers className="mx-auto text-gray-400 text-5xl mb-4" />
                  <p className="text-gray-500 font-medium">No students enrolled in this module</p>
                </div>
              )}
            </Card>

            {/* Bottom Summary */}
            {students.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{totalStudents}</span> students total • 
                  <span className="font-semibold text-purple-600 ml-2">{gradedCount}</span> graded • 
                  <span className="font-semibold text-yellow-600 ml-2">{pendingCount}</span> pending • 
                  <span className="font-semibold text-green-600 ml-2">{validatedCount}</span> validated
                </div>
                
                <button
                  onClick={handleSaveAll}
                  disabled={saving || gradedCount === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-semibold transition ${
                    saving || gradedCount === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 shadow-lg'
                  }`}
                >
                  <FaSave />
                  <span>{saving ? 'Saving...' : `Save All (${gradedCount})`}</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageGrades;