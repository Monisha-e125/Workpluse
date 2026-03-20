import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell } from 'lucide-react';
import { fetchUnreadCount } from '../../store/slices/notificationSlice';
import NotificationDropdown from '../notifications/NotificationDropdown';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((s) => s.notifications);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Fetch unread count on mount
  useEffect(() => {
    dispatch(fetchUnreadCount());

    // Refresh count every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default NotificationBell;