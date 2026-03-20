import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchMessages, addMessage, setTypingUser, clearChat } from '../../store/slices/chatSlice';
import useSocket from '../../hooks/useSocket';
import chatService from '../../services/chatService';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import ChatTypingIndicator from './ChatTypingIndicator';
import ChatEmptyState from './ChatEmptyState';
import Loader from '../common/Loader';

const ChatContainer = ({ projectId }) => {
  const dispatch = useDispatch();
  const { messages, isLoading, typingUsers } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);
  const messagesEndRef = useRef(null);
  const { joinProject, leaveProject, on, off, emitTyping } = useSocket();

  // Load messages
  useEffect(() => {
    if (projectId) {
      dispatch(fetchMessages({ projectId, params: { limit: 50 } }));
      joinProject(projectId);
    }

    return () => {
      if (projectId) {
        leaveProject(projectId);
        dispatch(clearChat());
      }
    };
  }, [projectId, dispatch, joinProject, leaveProject]);

  // Socket listeners
  useEffect(() => {
    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };

    const handleTyping = (data) => {
      if (data.userId !== user?._id) {
        dispatch(setTypingUser(data));
      }
    };

    on('new-message', handleNewMessage);
    on('user-typing', handleTyping);

    return () => {
      off('new-message', handleNewMessage);
      off('user-typing', handleTyping);
    };
  }, [on, off, dispatch, user]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSend = async (text) => {
    try {
      const res = await chatService.sendMessage(projectId, { text });
      // Message will arrive via socket, but add immediately for responsiveness
      dispatch(addMessage(res.data.data));
    } catch {
      toast.error('Failed to send message');
    }
  };

  // Typing indicator
  const handleTyping = useCallback((isTyping) => {
    emitTyping(projectId, isTyping);
  }, [projectId, emitTyping]);

  if (isLoading) return <Loader size="lg" text="Loading chat..." className="py-20" />;

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-700 flex items-center gap-3">
        <span className="text-xl">💬</span>
        <div>
          <h3 className="text-white font-medium text-sm">Team Chat</h3>
          <p className="text-dark-500 text-xs">{messages.length} messages</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatBubble
                key={msg._id}
                message={msg}
                isOwn={msg.sender?._id === user?._id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Typing Indicator */}
      <ChatTypingIndicator typingUsers={typingUsers} />

      {/* Input */}
      <ChatInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  );
};

export default ChatContainer;