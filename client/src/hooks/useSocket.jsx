import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addNotification } from '../store/slices/notificationSlice';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

// ═══ SINGLETON SOCKET — shared across all components ═══
let socket = null;
let isSetup = false;

const useSocket = () => {
  const { accessToken, isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);

  // Create socket connection ONCE
  useEffect(() => {
    if (isAuthenticated && accessToken && !socket) {
      console.log('🔌 Creating socket connection...');

      socket = io(SOCKET_URL, {
        auth: { token: accessToken },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000
      });

      socket.on('connect', () => {
        console.log('🔌 Socket connected:', socket.id);
        setIsConnected(true);
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (err) => {
        console.error('🔌 Socket error:', err.message);
        setIsConnected(false);
      });
    }

    // Cleanup only when user logs out
    if (!isAuthenticated && socket) {
      console.log('🔌 Destroying socket (logged out)');
      socket.disconnect();
      socket = null;
      isSetup = false;
      setIsConnected(false);
    }
  }, [isAuthenticated, accessToken]);

  // Setup global listeners ONCE
  useEffect(() => {
    if (socket && isAuthenticated && !isSetup) {
      isSetup = true;

      // ═══ GLOBAL NOTIFICATION LISTENER ═══
      socket.on('notification', (notification) => {
        console.log('🔔 Notification received:', notification.title);

        // Add to Redux store
        dispatch(addNotification(notification));

        // Show toast popup
        toast(
          (t) => (
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => toast.dismiss(t.id)}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                🔔 {notification.title}
              </div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {notifications.message}
              </div>
            </div>
          ),
          {
            duration: 5000,
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #6366f1',
              padding: '14px 18px',
              borderRadius: '12px',
              maxWidth: '400px'
            }
          }
        );
      });

      // ═══ GLOBAL TASK EVENTS ═══
      socket.on('task-created', (task) => {
        console.log('📋 Task created:', task.taskId);
      });

      socket.on('task-status-changed', (data) => {
        console.log('📋 Task moved:', data.taskId, '→', data.newStatus);
      });

      socket.on('new-assignment', (data) => {
        console.log('📋 New assignment:', data.message);
        toast(data.message, { icon: '📋', duration: 5000 });
      });

      console.log('✅ Global socket listeners setup complete');
    }
  }, [isAuthenticated, dispatch]);

  // ═══ METHODS ═══
  const joinProject = useCallback((projectId) => {
    if (socket) {
      socket.emit('join-project', projectId);
      console.log('📡 Joined project room:', projectId);
    }
  }, []);

  const leaveProject = useCallback((projectId) => {
    if (socket) {
      socket.emit('leave-project', projectId);
      console.log('📡 Left project room:', projectId);
    }
  }, []);

  const sendMessage = useCallback((data) => {
    if (socket) socket.emit('send-message', data);
  }, []);

  const emitTyping = useCallback((projectId, isTyping) => {
    if (socket) {
      socket.emit(isTyping ? 'typing-start' : 'typing-stop', { projectId });
    }
  }, []);

  const on = useCallback((event, handler) => {
    if (socket) socket.on(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    if (socket) socket.off(event, handler);
  }, []);

  return {
    socket,
    isConnected,
    joinProject,
    leaveProject,
    sendMessage,
    emitTyping,
    on,
    off
  };
};

export default useSocket;