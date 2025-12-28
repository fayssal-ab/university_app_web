import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import studentService from '../../services/studentService';
import { FaBell, FaTrash, FaCheckCircle, FaExclamationCircle, FaFileAlt, FaGraduationCap } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await studentService.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await studentService.markNotificationRead(notificationId);
      setNotifications(notifs =>
        notifs.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await studentService.deleteNotification(notificationId);
      setNotifications(notifs => notifs.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await studentService.markAllNotificationsRead();
      setNotifications(notifs => notifs.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <FaFileAlt className="text-blue-500" size={20} />;
      case 'grade':
        return <FaGraduationCap className="text-emerald-500" size={20} />;
      case 'announcement':
        return <FaExclamationCircle className="text-orange-500" size={20} />;
      default:
        return <FaBell className="text-gray-500" size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'assignment':
        return 'border-l-blue-500';
      case 'grade':
        return 'border-l-emerald-500';
      case 'announcement':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <p className="text-center text-gray-600">Loading...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-20 z-10">
            <div className="max-w-5xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <FaBell size={24} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredNotifications.length} {filter === 'unread' ? 'unread' : 'total'} notification{filteredNotifications.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="max-w-5xl mx-auto px-6 flex gap-8">
                <button
                  onClick={() => setFilter('all')}
                  className={`py-4 font-medium text-sm border-b-2 transition-colors ${
                    filter === 'all'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`py-4 font-medium text-sm border-b-2 transition-colors ${
                    filter === 'unread'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-w-5xl mx-auto px-6 py-8">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBell className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread'
                    ? "You're all caught up! Check back later."
                    : "You'll see your notifications here."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`bg-white rounded-xl border-l-4 ${getNotificationColor(notif.type)} border-b border-r border-gray-200 p-5 hover:shadow-lg transition-all duration-200 group ${
                      !notif.read ? 'bg-gradient-to-r from-blue-50 to-white' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="pt-1 flex-shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleMarkRead(notif._id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {notif.title}
                              </h3>
                              {!notif.read && (
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <span className="text-xs text-gray-500">
                                {notif.sender?.firstName || 'System'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatTime(notif.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkRead(notif._id)}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Mark as read"
                          >
                            <FaCheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notif._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;