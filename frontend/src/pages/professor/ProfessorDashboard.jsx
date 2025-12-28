import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import professorService from '../../services/professorService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { 
  FaBook, 
  FaUsers, 
  FaBullhorn, 
  FaChartLine, 
  FaClipboardList,
  FaArrowRight,
  FaClock,
  FaChevronRight,
  FaCheckCircle,
  FaTasks,
  FaUpload,
  FaCalendarAlt,
  FaArrowUp
} from 'react-icons/fa';

const ProfessorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const statsCards = [
    {
      title: 'My Modules',
      value: stats.totalModules || 0,
      icon: FaBook,
      gradient: 'from-blue-500 to-indigo-600',
      bgIcon: 'bg-blue-400',
      change: '+5%',
      description: 'Active courses',
      link: '/professor/modules'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: FaUsers,
      gradient: 'from-emerald-500 to-green-600',
      bgIcon: 'bg-emerald-400',
      change: '+12%',
      description: 'Across modules',
      link: '/professor/modules'
    },
    {
      title: 'Assignments',
      value: stats.totalAssignments || 0,
      icon: FaTasks,
      gradient: 'from-purple-500 to-pink-600',
      bgIcon: 'bg-purple-400',
      change: '+8%',
      description: 'Created tasks',
      link: '/professor/assignments'
    },
    {
      title: 'Pending Review',
      value: stats.pendingSubmissions || 0,
      icon: FaClock,
      gradient: 'from-orange-500 to-red-600',
      bgIcon: 'bg-orange-400',
      change: '-3%',
      description: 'Need grading',
      link: '/professor/assignments',
      badge: stats.pendingSubmissions > 0,
      isDecrease: true
    }
  ];

  const quickActions = [
    {
      title: 'View Modules',
      description: 'Manage courses and materials',
      icon: FaBook,
      link: '/professor/modules',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Grade Students',
      description: 'Evaluate and add grades',
      icon: FaChartLine,
      link: '/professor/modules',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Send Announcement',
      description: 'Notify students',
      icon: FaBullhorn,
      link: '/professor/announcements',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Upload Material',
      description: 'Share course content',
      icon: FaUpload,
      link: '/professor/modules',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Navbar onMenuToggle={setMenuOpen} menuOpen={menuOpen} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <span className="text-3xl text-white font-bold">
                    {professor?.user?.firstName?.[0]}{professor?.user?.lastName?.[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Welcome, Prof. {professor?.user?.lastName}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-2">
                      <FaCheckCircle size={12} />
                      {professor?.department}
                    </span>
                    {professor?.specialization && (
                      <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                        {professor?.specialization}
                      </span>
                    )}
                    <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold flex items-center gap-2">
                      <FaCalendarAlt size={10} />
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <Link key={index} to={stat.link}>
                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    
                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 ${stat.bgIcon} bg-opacity-30 rounded-2xl flex items-center justify-center relative`}>
                          <stat.icon className="text-3xl text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                          {stat.badge && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg">
                              !
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                          stat.isDecrease ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          <FaArrowUp size={10} className={stat.isDecrease ? 'rotate-180' : ''} />
                          {stat.change}
                        </div>
                      </div>
                      
                      <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                      <p className="text-sm font-bold text-gray-700 mb-1">{stat.title}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <FaClipboardList className="text-white" />
                </div>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-emerald-500 overflow-hidden h-full">
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                      <div className="relative p-6">
                        <div className={`w-16 h-16 ${action.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                          <action.icon className={`text-3xl ${action.iconColor}`} />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* My Modules */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FaBook className="text-white" />
                  </div>
                  My Modules
                </h2>
                {modules.length > 0 && (
                  <Link to="/professor/modules" className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    View All <FaChevronRight size={12} />
                  </Link>
                )}
              </div>

              {modules.length === 0 ? (
                <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBook className="text-gray-400 text-4xl" />
                  </div>
                  <p className="text-gray-600 font-semibold text-lg mb-2">No modules assigned yet</p>
                  <p className="text-gray-500 text-sm">Contact your administrator to get courses assigned</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {modules.slice(0, 4).map((module) => (
                    <Card key={module._id} className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500">
                      <div className="p-5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                            <FaBook className="text-white text-2xl" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">
                              {module.name}
                            </h3>
                            
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold text-xs">
                                {module.code}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600 font-medium text-sm">S{module.semester}</span>
                              
                              {module.level && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-bold text-xs">
                                    {module.level.shortName}
                                  </span>
                                </>
                              )}
                              
                              {module.level?.branch && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs">
                                    {module.level.branch.code}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaUsers className="text-emerald-600" />
                            <span className="font-bold">{module.studentCount || 0}</span>
                            <span className="text-sm">students enrolled</span>
                          </div>
                          
                          <Link
                            to={`/professor/modules/${module._id}/manage`}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-bold shadow-lg hover:shadow-xl flex items-center gap-2 group-hover:scale-105"
                          >
                            Manage
                            <FaArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 text-white">
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Quick Tip</h3>
                  <p className="text-emerald-50 text-sm leading-relaxed">
                    Keep students engaged by uploading materials regularly and providing timely feedback on their work.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessorDashboard;