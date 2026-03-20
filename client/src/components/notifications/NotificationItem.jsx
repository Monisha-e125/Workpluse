import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { markAsRead } from '../../store/slices/notificationSlice';
import Avatar from '../common/Avatar';
import { timeAgo } from '../../utils/helpers';

const typeIcons = {
  'task-assigned': '📋', 'task-updated': '✏️', 'task-completed': '✅',
  'comment-added': '💬', 'mention': '@', 'sprint-started': '🏃',
  'burnout-alert': '🔥', 'mood-reminder': '💚', 'standup-ready': '🤖',
  'project-invite': '📧', 'overdue-task': '⏰', 'ai-suggestion': '🧠',
  'chat-message': '💬', 'member-added': '👤', 'member-removed': '👤'
};

const NotificationItem = ({ notification, onClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    if (notification.link) {
      navigate(notification.link);
    }
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors
                  hover:bg-dark-700 ${!notification.isRead ? 'bg-primary-500/5' : ''}`}
    >
      {/* Icon or Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {notification.sender ? (
          <Avatar
            firstName={notification.sender.firstName}
            lastName={notification.sender.lastName}
            src={notification.sender.avatar}
            size="sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-sm">
            {typeIcons[notification.type] || '🔔'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-dark-200 line-clamp-2">
          <span className="font-medium text-white">{notification.title}</span>
          {' '}{notification.message}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-dark-500">{timeAgo(notification.createdAt)}</span>
          {notification.project && (
            <span className="text-xs text-dark-500">
              • {notification.project.icon} {notification.project.name}
            </span>
          )}
        </div>
      </div>

      {/* Unread Dot */}
      {!notification.isRead && (
        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
      )}
    </button>
  );
};

export default NotificationItem;