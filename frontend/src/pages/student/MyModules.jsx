import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaBook, FaChalkboardTeacher, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MyModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSemesters, setOpenSemesters] = useState({});

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await studentService.getModules();
      const modulesList = response.data || [];
      setModules(modulesList);
      
      // Auto-open all semesters by default
      const initialOpen = {};
      modulesList.forEach(m => {
        initialOpen[`S${m.semester}`] = true;
      });
      setOpenSemesters(initialOpen);
    } catch (error) {
      console.error('Error fetching modules:', error);
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

  // Group modules by semester
  const groupedModules = modules.reduce((acc, module) => {
    const semester = `S${module.semester}`;
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(module);
    return acc;
  }, {});

  const semesters = Object.keys(groupedModules).sort();

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Modules</h1>
              <p className="text-gray-600 mt-2">
                Your enrolled modules organized by semester • {modules.length} total modules
              </p>
            </div>

            {modules.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <FaBook className="mx-auto text-gray-400 text-5xl mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No modules enrolled yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Please contact your administrator to enroll in modules
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {semesters.map((semester) => {
                  const semesterModules = groupedModules[semester];
                  const isOpen = openSemesters[semester];
                  const totalCoef = semesterModules.reduce((sum, m) => sum + (m.coefficient || 0), 0);

                  return (
                    <Card key={semester} className="overflow-hidden">
                      {/* Semester Header - Clickable */}
                      <button
                        onClick={() => toggleSemester(semester)}
                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-xl">
                            {semester}
                          </div>
                          <div className="text-left">
                            <h2 className="text-xl font-bold text-gray-900">
                              Semester {semester.replace('S', '')}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {semesterModules.length} modules • Total Coefficient: {totalCoef}
                            </p>
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
                                    Coefficient
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Professor
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    Materials
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {semesterModules.map((module, index) => (
                                  <tr key={module._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="text-sm font-bold text-blue-600">
                                        {module.code}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {module.name}
                                      </div>
                                      {module.description && (
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                          {module.description}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <span className="px-3 py-1 text-sm font-bold text-blue-800 bg-blue-100 rounded-full">
                                        {module.coefficient}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      {module.professor ? (
                                        <div className="flex items-center text-sm text-gray-700">
                                          <FaChalkboardTeacher className="mr-2 text-gray-400" />
                                          <div>
                                            <div className="font-medium">
                                              {module.professor.user?.firstName} {module.professor.user?.lastName}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-sm text-gray-400">Not assigned</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                        {module.materials?.length || 0} files
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <Link
                                        to={`/student/modules/${module._id}`}
                                        className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                      >
                                        <FaEye />
                                        <span>View</span>
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td colSpan="2" className="px-6 py-4 text-sm font-bold text-gray-900">
                                    {semester} Total
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="px-3 py-1 text-sm font-bold text-gray-900 bg-gray-200 rounded-full">
                                      {totalCoef}
                                    </span>
                                  </td>
                                  <td colSpan="3" className="px-6 py-4 text-sm text-gray-600">
                                    {semesterModules.length} module(s) enrolled
                                  </td>
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

            {/* Summary Statistics */}
            {modules.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="bg-blue-50 border-blue-200">
                  <div className="text-center py-4">
                    <FaBook className="mx-auto text-blue-600 text-3xl mb-2" />
                    <p className="text-sm text-blue-800 font-medium">Total Modules</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">
                      {modules.length}
                    </p>
                  </div>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <div className="text-center py-4">
                    <FaChalkboardTeacher className="mx-auto text-purple-600 text-3xl mb-2" />
                    <p className="text-sm text-purple-800 font-medium">Total Coefficient</p>
                    <p className="text-3xl font-bold text-purple-900 mt-1">
                      {modules.reduce((sum, m) => sum + (m.coefficient || 0), 0)}
                    </p>
                  </div>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <div className="text-center py-4">
                    <FaBook className="mx-auto text-green-600 text-3xl mb-2" />
                    <p className="text-sm text-green-800 font-medium">Materials Available</p>
                    <p className="text-3xl font-bold text-green-900 mt-1">
                      {modules.reduce((sum, m) => sum + (m.materials?.length || 0), 0)}
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyModules;