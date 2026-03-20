import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Check, Trash2 } from 'lucide-react';
import { fetchNotifications, markAllRead } from '../../store/slices/notificationSlice';
import NotificationItem from './NotificationItem';
import Loader from '../common/Loader';

const NotificationDropdown = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, isLoading, unreadCount } = useSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({ limit: 20 }));
  }, [dispatch]);

  return (
    <div className="absolute right-0 mt-2 w-96 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl z-50 animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700">
        <div>
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-dark-400">{unreadCount} unread</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => dispatch(markAllRead())}
              className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              <Check size={12} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <Loader size="sm" className="py-8" />
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-4xl">🔔</span>
            <p className="text-dark-400 text-sm mt-2">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-700">
            {notifications.map((notif) => (
              <NotificationItem key={notif._id} notification={notif} onClick={onClose} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-dark-700 p-2">
          <button
            onClick={() => { navigate('/notifications'); onClose(); }}
            className="w-full py-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-dark-700 rounded-lg transition-colors"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;