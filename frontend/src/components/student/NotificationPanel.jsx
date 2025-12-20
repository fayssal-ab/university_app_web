import { FaBell, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const NotificationPanel = ({ notifications, onMarkRead }) => {
  const getNotificationIcon = (type) => {
    const icons = {
      announcement: '📢',
      grade: '📊',
      assignment: '📝',
      submission: '✅',
      general: '💬',
      system: '⚙️'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaBell size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No notifications</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 rounded-lg border transition ${
              notification.read
                ? 'bg-white border-gray-200'
                : 'bg-blue-50 border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              {!notification.read && (
                <button
                  onClick={() => onMarkRead(notification._id)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Mark as read"
                >
                  <FaCheckCircle size={20} />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPanel;