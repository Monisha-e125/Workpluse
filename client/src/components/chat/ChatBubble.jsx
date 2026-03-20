import Avatar from '../common/Avatar';
import { formatDateTime, timeAgo } from '../../utils/helpers';

const ChatBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar
        firstName={message.sender?.firstName}
        lastName={message.sender?.lastName}
        src={message.sender?.avatar}
        size="sm"
      />
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Name & Time */}
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-medium text-dark-300">
            {isOwn ? 'You' : `${message.sender?.firstName} ${message.sender?.lastName}`}
          </span>
          <span className="text-xs text-dark-500">{timeAgo(message.createdAt)}</span>
        </div>

        {/* Message Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-primary-600 text-white rounded-tr-md'
              : 'bg-dark-700 text-dark-200 rounded-tl-md'
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;