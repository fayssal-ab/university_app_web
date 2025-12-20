import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaBook, FaTasks, FaClock, FaUpload } from 'react-icons/fa';

const ProfessorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await professorService.getDashboard();
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
              Welcome, Prof. {dashboardData?.professor?.user?.lastName}! 👨‍🏫
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Assigned Modules</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.totalModules || 0}</h3>
                  </div>
                  <FaBook size={40} className="text-blue-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Assignments</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.totalAssignments || 0}</h3>
                  </div>
                  <FaTasks size={40} className="text-purple-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Pending Submissions</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.pendingSubmissions || 0}</h3>
                  </div>
                  <FaClock size={40} className="text-orange-200" />
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/professor/modules">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaBook size={48} className="mx-auto text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">My Modules</h3>
                    <p className="text-sm text-gray-600 mt-2">Manage your modules</p>
                  </div>
                </Card>
              </Link>

              <Link to="/professor/assignments/create">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaTasks size={48} className="mx-auto text-purple-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Create Assignment</h3>
                    <p className="text-sm text-gray-600 mt-2">Add new assignment</p>
                  </div>
                </Card>
              </Link>

              <Link to="/professor/announcements">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaUpload size={48} className="mx-auto text-green-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
                    <p className="text-sm text-gray-600 mt-2">Send to students</p>
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

export default ProfessorDashboard;