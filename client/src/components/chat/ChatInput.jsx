import { useState, useRef } from 'react';
import { Send, Smile } from 'lucide-react';

const ChatInput = ({ onSend, onTyping }) => {
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);

    // Emit typing
    onTyping?.(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTyping?.(false);
    }, 2000);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    onTyping?.(false);
    clearTimeout(typingTimeoutRef.current);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-dark-700 p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full bg-dark-700 border border-dark-600 text-dark-200 rounded-xl
                       px-4 py-3 pr-10 text-sm placeholder-dark-500 focus:border-primary-500
                       focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none
                       transition-colors"
            style={{ maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;