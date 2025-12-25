import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { FaGraduationCap, FaChalkboardTeacher, FaBook, FaUsers } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminService.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Admin Dashboard
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Classes</p>
                    <h3 className="text-3xl font-bold mt-2">{stats?.totalLevels || 0}</h3>
                  </div>
                  <FaUsers size={40} className="text-blue-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Students</p>
                    <h3 className="text-3xl font-bold mt-2">{stats?.totalStudents || 0}</h3>
                  </div>
                  <FaGraduationCap size={40} className="text-green-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Professors</p>
                    <h3 className="text-3xl font-bold mt-2">{stats?.totalProfessors || 0}</h3>
                  </div>
                  <FaChalkboardTeacher size={40} className="text-purple-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Modules</p>
                    <h3 className="text-3xl font-bold mt-2">{stats?.totalModules || 0}</h3>
                  </div>
                  <FaBook size={40} className="text-orange-200" />
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/admin/classes">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaUsers size={48} className="mx-auto text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Manage Classes</h3>
                    <p className="text-sm text-gray-600 mt-2">View and manage student classes</p>
                  </div>
                </Card>
              </Link>

              <Link to="/admin/professors">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaChalkboardTeacher size={48} className="mx-auto text-purple-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Manage Professors</h3>
                    <p className="text-sm text-gray-600 mt-2">Add and manage professors</p>
                  </div>
                </Card>
              </Link>

              <Link to="/admin/modules">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaBook size={48} className="mx-auto text-orange-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Manage Modules</h3>
                    <p className="text-sm text-gray-600 mt-2">Add and assign modules</p>
                  </div>
                </Card>
              </Link>

              <Link to="/admin/grades">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="text-center py-6">
                    <FaGraduationCap size={48} className="mx-auto text-green-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Validate Grades</h3>
                    <p className="text-sm text-gray-600 mt-2">Review and validate grades</p>
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

export default AdminDashboard;