import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaBook, 
  FaUsers, 
  FaCheckCircle,
  FaChartLine,
  FaClipboardList,
  FaArrowUp,
  FaClock,
  FaSitemap
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const statsCards = [
    {
      title: 'Branches',
      value: stats?.totalBranches || 0,
      icon: FaSitemap,
      gradient: 'from-cyan-500 to-blue-600',
      bgIcon: 'bg-cyan-400',
      change: '+12%',
      isIncrease: true,
      description: 'Active branches'
    },
    {
      title: 'Classes',
      value: stats?.totalLevels || 0,
      icon: FaUsers,
      gradient: 'from-blue-500 to-indigo-600',
      bgIcon: 'bg-blue-400',
      change: '+8%',
      isIncrease: true,
      description: 'Total classes'
    },
    {
      title: 'Students',
      value: stats?.totalStudents || 0,
      icon: FaGraduationCap,
      gradient: 'from-emerald-500 to-green-600',
      bgIcon: 'bg-emerald-400',
      change: '+15%',
      isIncrease: true,
      description: 'Enrolled students'
    },
    {
      title: 'Professors',
      value: stats?.totalProfessors || 0,
      icon: FaChalkboardTeacher,
      gradient: 'from-purple-500 to-pink-600',
      bgIcon: 'bg-purple-400',
      change: '+5%',
      isIncrease: true,
      description: 'Active professors'
    },
    {
      title: 'Modules',
      value: stats?.totalModules || 0,
      icon: FaBook,
      gradient: 'from-orange-500 to-red-600',
      bgIcon: 'bg-orange-400',
      change: '+10%',
      isIncrease: true,
      description: 'Total modules'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Branches',
      description: 'Create and manage academic branches',
      icon: FaSitemap,
      link: '/admin/branches',
      gradient: 'from-cyan-500 to-blue-600',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Manage Classes',
      description: 'View and manage student classes',
      icon: FaUsers,
      link: '/admin/classes',
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Manage Students',
      description: 'Add and manage students',
      icon: FaGraduationCap,
      link: '/admin/students',
      gradient: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Manage Professors',
      description: 'Add and manage professors',
      icon: FaChalkboardTeacher,
      link: '/admin/professors',
      gradient: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Manage Modules',
      description: 'Add and assign modules',
      icon: FaBook,
      link: '/admin/modules',
      gradient: 'from-orange-500 to-red-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Validate Grades',
      description: 'Review and validate grades',
      icon: FaCheckCircle,
      link: '/admin/grades',
      gradient: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Navbar onMenuToggle={setMenuOpen} menuOpen={menuOpen} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FaChartLine className="text-white text-xl" />
                    </div>
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2 ml-15">Monitor and manage your institution</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaClock className="text-gray-400" />
                  <span className="text-gray-600">Last updated: Just now</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}></div>
                  
                  {/* Content */}
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 ${stat.bgIcon} bg-opacity-30 rounded-2xl flex items-center justify-center`}>
                        <stat.icon className={`text-3xl text-white`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                        stat.isIncrease ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <FaArrowUp size={10} />
                        {stat.change}
                      </div>
                    </div>
                    
                    <h3 className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Actions - Full Width */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaClipboardList className="text-emerald-600" />
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-emerald-500 h-full">
                      <div className="relative overflow-hidden">
                        {/* Gradient on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        
                        <div className="relative p-6">
                          <div className={`w-16 h-16 ${action.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                            <action.icon className={`text-3xl ${action.iconColor}`} />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;