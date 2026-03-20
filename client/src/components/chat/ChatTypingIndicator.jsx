const ChatTypingIndicator = ({ typingUsers }) => {
  if (!typingUsers || typingUsers.length === 0) return null;

  const names = typingUsers.map((u) => u.userName).join(', ');

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs text-dark-400">
        {names} {typingUsers.length === 1 ? 'is' : 'are'} typing...
      </span>
    </div>
  );
};

export default ChatTypingIndicator;