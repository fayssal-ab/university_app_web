import { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaCheckCircle, FaClock, FaBook, FaTrophy, FaChartLine, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MyGrades = () => {
  const [gradesData, setGradesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSemesters, setOpenSemesters] = useState({});

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await studentService.getGrades();
      setGradesData(response.data);
      
      // Auto-open all semesters by default
      const grades = response.data?.grades?.filter(g => g.validated) || [];
      const initialOpen = {};
      grades.forEach(g => {
        initialOpen[`S${g.semester}`] = true;
      });
      setOpenSemesters(initialOpen);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSemester = (semester) => {
    setOpenSemesters(prev => ({
      ...prev,
      [semester]: !prev[semester]
    }));
  };

  if (loading) return <Loader />;

  const validatedGrades = gradesData?.grades?.filter(g => g.validated) || [];
  const pendingGrades = gradesData?.grades?.filter(g => !g.validated) || [];

  // Group grades by semester
  const groupedGrades = validatedGrades.reduce((acc, grade) => {
    const semester = `S${grade.semester}`;
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(grade);
    return acc;
  }, {});

  const semesters = Object.keys(groupedGrades).sort();

  // Calculate semester averages
  const semesterStats = {};
  semesters.forEach(sem => {
    const grades = groupedGrades[sem];
    const totalCoef = grades.reduce((sum, g) => sum + (g.module?.coefficient || 1), 0);
    const weightedSum = grades.reduce((sum, g) => sum + (g.value * (g.module?.coefficient || 1)), 0);
    const average = (weightedSum / totalCoef).toFixed(2);
    const passed = grades.filter(g => g.value >= 10).length;
    const failed = grades.filter(g => g.value < 10).length;
    
    semesterStats[sem] = { average, totalCoef, passed, failed };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Grades</h1>

            {/* Averages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Current Semester</p>
                    <h3 className="text-4xl font-bold mt-2">{gradesData?.semesterAverage || '0.00'}/20</h3>
                    <p className="text-blue-100 text-xs mt-1">Validated grades only</p>
                  </div>
                  <div className="bg-blue-400 bg-opacity-30 p-4 rounded-xl">
                    <FaCheckCircle size={32} />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Yearly Average</p>
                    <h3 className="text-4xl font-bold mt-2">{gradesData?.yearlyAverage || '0.00'}/20</h3>
                    <p className="text-green-100 text-xs mt-1">All semesters</p>
                  </div>
                  <div className="bg-green-400 bg-opacity-30 p-4 rounded-xl">
                    <FaTrophy size={32} />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Modules Graded</p>
                    <h3 className="text-4xl font-bold mt-2">{validatedGrades.length}</h3>
                    <p className="text-purple-100 text-xs mt-1">{pendingGrades.length} pending</p>
                  </div>
                  <div className="bg-purple-400 bg-opacity-30 p-4 rounded-xl">
                    <FaBook size={32} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Pending Grades Alert */}
            {pendingGrades.length > 0 && (
              <Card className="mb-6 bg-yellow-50 border-yellow-200">
                <div className="flex items-start space-x-3">
                  <FaClock className="text-yellow-600 text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      {pendingGrades.length} Grade(s) Pending Validation
                    </h3>
                    <p className="text-sm text-yellow-800">
                      Your professor has submitted grades for {pendingGrades.length} module(s), 
                      but they are awaiting admin validation.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Grades by Semester - Accordion */}
            {semesters.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <FaBook className="mx-auto text-gray-400 text-5xl mb-4" />
                  <p className="text-gray-500 font-medium">No validated grades yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Grades will appear here once validated by admin
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {semesters.map((semester) => {
                  const grades = groupedGrades[semester];
                  const stats = semesterStats[semester];
                  const isOpen = openSemesters[semester];
                  const semesterPassed = parseFloat(stats.average) >= 10;

                  return (
                    <Card key={semester} className="overflow-hidden">
                      {/* Semester Header - Clickable */}
                      <button
                        onClick={() => toggleSemester(semester)}
                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`px-6 py-3 rounded-lg font-bold text-xl text-white ${
                            semesterPassed ? 'bg-green-600' : 'bg-red-600'
                          }`}>
                            {semester}
                          </div>
                          <div className="text-left">
                            <h2 className="text-xl font-bold text-gray-900">
                              Semester {semester.replace('S', '')}
                            </h2>
                            <div className="flex items-center space-x-4 text-sm mt-1">
                              <div className="flex items-center space-x-2">
                                <FaChartLine className="text-blue-600" />
                                <span className={`font-bold ${semesterPassed ? 'text-green-600' : 'text-red-600'}`}>
                                  Average: {stats.average}/20
                                </span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">Coef: {stats.totalCoef}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-green-600 font-semibold">{stats.passed} Passed</span>
                              <span className="text-gray-400">/</span>
                              <span className="text-red-600 font-semibold">{stats.failed} Failed</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {isOpen ? 'Click to collapse' : 'Click to expand'}
                          </span>
                          {isOpen ? (
                            <FaChevronUp className="text-gray-500 text-xl" />
                          ) : (
                            <FaChevronDown className="text-gray-500 text-xl" />
                          )}
                        </div>
                      </button>

                      {/* Semester Content - Collapsible */}
                      {isOpen && (
                        <div className="border-t border-gray-200">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Code
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Module Name
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    Coef
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    Grade
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    Result
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Comments
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {grades.map((grade) => {
                                  const passed = grade.value >= 10;
                                  
                                  return (
                                    <tr 
                                      key={grade._id} 
                                      className={`hover:bg-gray-50 transition ${
                                        passed ? 'bg-green-50 bg-opacity-30' : 'bg-red-50 bg-opacity-30'
                                      }`}
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                        {grade.module?.code}
                                      </td>
                                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {grade.module?.name}
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 text-sm font-bold text-gray-700 bg-gray-100 rounded">
                                          {grade.module?.coefficient}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <span className={`text-2xl font-bold ${
                                          passed ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {grade.value}/20
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                          passed 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {passed ? '✓ Passed' : '✗ Failed'}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-600">
                                        {grade.comments || '-'}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot className="bg-gray-100">
                                <tr>
                                  <td colSpan="2" className="px-6 py-4 text-sm font-bold text-gray-900">
                                    {semester} Average
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="px-3 py-1 text-sm font-bold text-gray-900 bg-white rounded">
                                      {stats.totalCoef}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className={`text-2xl font-bold ${
                                      semesterPassed ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {stats.average}/20
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                      semesterPassed 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {semesterPassed ? 'Validated' : 'Not Validated'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4"></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyGrades;