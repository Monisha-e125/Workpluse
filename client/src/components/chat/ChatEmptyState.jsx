const ChatEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full py-20">
    <span className="text-6xl mb-4">💬</span>
    <h3 className="text-lg font-semibold text-white mb-2">No messages yet</h3>
    <p className="text-dark-400 text-sm text-center max-w-xs">
      Start the conversation! Send the first message to your team.
    </p>
  </div>
);

export default ChatEmptyState;