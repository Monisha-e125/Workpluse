import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Trash2 } from 'lucide-react';
import { fetchNotifications, markAllRead } from '../../store/slices/notificationSlice';
import notificationService from '../../services/notificationService';
import NotificationItem from '../../components/notifications/NotificationItem';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading, unreadCount } = useSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications({ limit: 50 })); }, [dispatch]);

  const handleClearAll = async () => {
    try {
      await notificationService.clearAll();
      dispatch(fetchNotifications({ limit: 50 }));
      toast.success('All notifications cleared');
    } catch { toast.error('Failed to clear'); }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-dark-400 text-sm mt-1">{unreadCount} unread</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" icon={Check} onClick={() => dispatch(markAllRead())}>
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" icon={Trash2} onClick={handleClearAll}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <Loader size="lg" className="py-20" />
        ) : notifications.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications" description="You're all caught up!" />
        ) : (
          <div className="divide-y divide-dark-700">
            {notifications.map((notif) => (
              <NotificationItem key={notif._id} notification={notif} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;