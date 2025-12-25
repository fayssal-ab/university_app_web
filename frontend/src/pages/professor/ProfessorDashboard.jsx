import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaBook, FaTasks, FaClock, FaBullhorn, FaChartLine, FaUsers } from 'react-icons/fa';

const ProfessorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashResponse, modulesResponse] = await Promise.all([
        professorService.getDashboard(),
        professorService.getModules()
      ]);
      
      setDashboardData(dashResponse.data);
      setModules(modulesResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const stats = dashboardData?.stats || {};
  const professor = dashboardData?.professor;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, Prof. {professor?.user?.lastName}! 👨‍🏫
              </h1>
              <p className="text-gray-600 mt-2">
                {professor?.department} • {professor?.specialization || 'Faculty Member'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Assigned Modules</p>
                    <h3 className="text-4xl font-bold mt-2">{stats.totalModules || 0}</h3>
                    <p className="text-blue-100 text-xs mt-1">Active courses</p>
                  </div>
                  <div className="bg-blue-400 bg-opacity-30 p-4 rounded-xl">
                    <FaBook size={32} className="text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Assignments</p>
                    <h3 className="text-4xl font-bold mt-2">{stats.totalAssignments || 0}</h3>
                    <p className="text-purple-100 text-xs mt-1">Created tasks</p>
                  </div>
                  <div className="bg-purple-400 bg-opacity-30 p-4 rounded-xl">
                    <FaTasks size={32} className="text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Pending Review</p>
                    <h3 className="text-4xl font-bold mt-2">{stats.pendingSubmissions || 0}</h3>
                    <p className="text-orange-100 text-xs mt-1">Need grading</p>
                  </div>
                  <div className="bg-orange-400 bg-opacity-30 p-4 rounded-xl">
                    <FaClock size={32} className="text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Students</p>
                    <h3 className="text-4xl font-bold mt-2">{stats.totalStudents || 0}</h3>
                    <p className="text-green-100 text-xs mt-1">Across modules</p>
                  </div>
                  <div className="bg-green-400 bg-opacity-30 p-4 rounded-xl">
                    <FaUsers size={32} className="text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/professor/modules">
                  <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-500">
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBook size={28} className="text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">My Modules</h3>
                      <p className="text-sm text-gray-600 mt-2">View & manage courses</p>
                    </div>
                  </Card>
                </Link>

                <Link to="/professor/assignments/create">
                  <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-500">
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTasks size={28} className="text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">New Assignment</h3>
                      <p className="text-sm text-gray-600 mt-2">Create task for students</p>
                    </div>
                  </Card>
                </Link>

                <Link to="/professor/announcements">
                  <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-green-500">
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBullhorn size={28} className="text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Announcement</h3>
                      <p className="text-sm text-gray-600 mt-2">Notify your students</p>
                    </div>
                  </Card>
                </Link>

                <Link to="/professor/modules">
                  <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-orange-500">
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaChartLine size={28} className="text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Manage Grades</h3>
                      <p className="text-sm text-gray-600 mt-2">Grade your students</p>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Your Modules */}
            {modules.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Modules</h3>
                  <Link to="/professor/modules" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All →
                  </Link>
                </div>
                <div className="space-y-3">
                  {modules.slice(0, 5).map((module) => (
                    <div
                      key={module._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaBook className="text-blue-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {module.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">{module.code}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">S{module.semester}</span>
                            {module.level && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
                                  {module.level.shortName}
                                </span>
                                {module.level.branch && (
                                  <span className="text-xs text-gray-500">
                                    ({module.level.branch.code})
                                  </span>
                                )}
                              </>
                            )}
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">
                              {module.studentCount || 0} students
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/professor/modules/${module._id}/manage`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Manage
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessorDashboard;