import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { 
  FaBook, 
  FaBell, 
  FaGraduationCap,
  FaArrowRight,
  FaChevronRight,
  FaTrophy,
  FaClock,
  FaChartLine,
  FaCheckCircle,
  FaExclamationCircle,
  FaBolt,
  FaInfoCircle
} from 'react-icons/fa';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
  const student = dashboardData?.student;
  const average = parseFloat(stats.average) || 0;

  // Check if student actually has grades
  const hasGrades = average > 0;

  // Determine grade status only if has grades
  const getGradeStatus = (avg) => {
    if (!hasGrades || avg === 0) {
      return { 
        text: 'No grades published', 
        color: 'text-gray-600', 
        bg: 'bg-gray-100', 
        icon: FaInfoCircle,
        message: 'Your professors have not published any grades yet. Check back soon.'
      };
    }
    if (avg >= 16) {
      return { 
        text: 'Excellent', 
        color: 'text-green-600', 
        bg: 'bg-green-100', 
        icon: FaTrophy,
        message: 'Outstanding performance! You are excelling in your studies.'
      };
    }
    if (avg >= 14) {
      return { 
        text: 'Very Good', 
        color: 'text-blue-600', 
        bg: 'bg-blue-100', 
        icon: FaCheckCircle,
        message: 'Great work! You are performing very well in your courses.'
      };
    }
    if (avg >= 12) {
      return { 
        text: 'Good', 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-100', 
        icon: FaCheckCircle,
        message: 'You are doing well. Keep maintaining this good performance.'
      };
    }
    if (avg >= 10) {
      return { 
        text: 'Pass', 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100', 
        icon: FaClock,
        message: 'You are passing. Focus more to improve your grades.'
      };
    }
    return { 
      text: 'Needs Improvement', 
      color: 'text-orange-600', 
      bg: 'bg-orange-100', 
      icon: FaExclamationCircle,
      message: 'Additional effort needed. Consider seeking help from your professors.'
    };
  };

  const gradeStatus = getGradeStatus(average);

  const statsCards = [
    {
      title: 'Enrolled Modules',
      value: stats.totalModules || 0,
      icon: FaBook,
      gradient: 'from-blue-500 to-indigo-600',
      bgIcon: 'bg-blue-400',
      description: 'Active courses',
      link: '/student/modules'
    },
    {
      title: 'Average Grade',
      value: hasGrades ? `${average.toFixed(2)}/20` : 'N/A',
      icon: FaGraduationCap,
      gradient: hasGrades ? (average >= 12 ? 'from-emerald-500 to-green-600' : 'from-orange-500 to-red-600') : 'from-gray-400 to-gray-500',
      bgIcon: hasGrades ? (average >= 12 ? 'bg-emerald-400' : 'bg-orange-400') : 'bg-gray-400',
      description: gradeStatus.text,
      link: '/student/grades'
    },
    {
      title: 'Notifications',
      value: stats.unreadNotifications || 0,
      icon: FaBell,
      gradient: 'from-purple-500 to-pink-600',
      bgIcon: 'bg-purple-400',
      description: 'Unread messages',
      link: '/student/notifications',
      badge: stats.unreadNotifications > 0
    }
  ];

  const quickActions = [
    {
      title: 'My Modules',
      description: 'View course materials and content',
      icon: FaBook,
      link: '/student/modules',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'My Grades',
      description: 'Check your academic performance',
      icon: FaGraduationCap,
      link: '/student/grades',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      gradient: 'from-emerald-500 to-green-600',
      highlight: hasGrades && average >= 14
    },
    {
      title: 'Notifications',
      description: 'View announcements and updates',
      icon: FaBell,
      link: '/student/notifications',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-600',
      badge: stats.unreadNotifications > 0
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
              <div className="flex items-center gap-4 mb-6">
                {student?.user?.profilePicture ? (
                  <img 
                    src={student.user.profilePicture} 
                    alt="Profile"
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl text-white font-bold">
                      {student?.user?.firstName?.[0] || 'S'}{student?.user?.lastName?.[0] || 'T'}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Welcome back, {student?.user?.firstName || 'Student'}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {student?.level?.name && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {student.level.name}
                      </span>
                    )}
                    {student?.field && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                        {student.field}
                      </span>
                    )}
                    {student?.academicYear && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {student.academicYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <Link key={index} to={stat.link}>
                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    
                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 ${stat.bgIcon} bg-opacity-30 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative`}>
                          <stat.icon className="text-3xl text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                          {stat.badge && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                              {stat.value}
                            </div>
                          )}
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      
                      <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                      <p className="text-sm font-semibold text-gray-700 mb-1">{stat.title}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBolt className="text-orange-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-emerald-500 relative overflow-hidden h-full">
                      {action.highlight && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1">
                            <FaTrophy size={10} />
                            Great
                          </div>
                        </div>
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                      <div className="relative p-6">
                        <div className={`w-16 h-16 ${action.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md relative`}>
                          <action.icon className={`text-3xl ${action.iconColor}`} />
                          {action.badge && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {stats.unreadNotifications}
                            </div>
                          )}
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

            {/* Performance Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaChartLine className="text-emerald-600" />
                Performance Overview
              </h2>

              {hasGrades ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-emerald-700 font-medium mb-1">Current Average</p>
                          <h3 className="text-5xl font-bold text-emerald-900">
                            {average.toFixed(2)}
                            <span className="text-2xl text-emerald-600">/20</span>
                          </h3>
                        </div>
                        <div className={`w-20 h-20 ${gradeStatus.bg} rounded-2xl flex items-center justify-center`}>
                          <gradeStatus.icon className={`text-4xl ${gradeStatus.color}`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`px-3 py-1 ${gradeStatus.bg} ${gradeStatus.color} rounded-full text-sm font-bold`}>
                          {gradeStatus.text}
                        </div>
                        {average >= 14 && (
                          <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold flex items-center gap-1">
                            <FaTrophy size={12} />
                            Top Student
                          </div>
                        )}
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden mb-3">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000"
                          style={{ width: `${(average / 20) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-emerald-800 leading-relaxed">
                        {gradeStatus.message}
                      </p>
                    </div>
                  </Card>

                  <div className="space-y-4">
                    <Card className="hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FaBook className="text-blue-600 text-xl" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Enrolled Modules</p>
                            <h4 className="text-2xl font-bold text-gray-900">{stats.totalModules || 0}</h4>
                          </div>
                        </div>
                        <Link to="/student/modules" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                          View Modules <FaChevronRight size={12} />
                        </Link>
                      </div>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <FaBell className="text-purple-600 text-xl" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">New Notifications</p>
                            <h4 className="text-2xl font-bold text-gray-900">{stats.unreadNotifications || 0}</h4>
                          </div>
                        </div>
                        <Link to="/student/notifications" className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1">
                          View All <FaChevronRight size={12} />
                        </Link>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
                  <div className="p-12 text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaInfoCircle className="text-gray-400 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">No Grades Published Yet</h3>
                    <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                      Your professors have not published any grades yet. Once grades are available, they will appear here.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;