import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaBook, FaTasks, FaBell, FaGraduationCap } from 'react-icons/fa';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await studentService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const stats = dashboardData?.stats || {};

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Welcome back, {dashboardData?.student?.user?.firstName}! 👋
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Modules</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.totalModules || 0}</h3>
                  </div>
                  <FaBook size={40} className="text-blue-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Pending Assignments</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.pendingAssignments || 0}</h3>
                  </div>
                  <FaTasks size={40} className="text-purple-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Average Grade</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.average || '0.00'}/20</h3>
                  </div>
                  <FaGraduationCap size={40} className="text-green-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Notifications</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.unreadNotifications || 0}</h3>
                  </div>
                  <FaBell size={40} className="text-yellow-200" />
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/student/modules">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaBook size={48} className="mx-auto text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">My Modules</h3>
                    <p className="text-sm text-gray-600 mt-2">View enrolled modules</p>
                  </div>
                </Card>
              </Link>

              <Link to="/student/assignments">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaTasks size={48} className="mx-auto text-purple-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
                    <p className="text-sm text-gray-600 mt-2">View and submit assignments</p>
                  </div>
                </Card>
              </Link>

              <Link to="/student/grades">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaGraduationCap size={48} className="mx-auto text-green-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">My Grades</h3>
                    <p className="text-sm text-gray-600 mt-2">Check your grades</p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;