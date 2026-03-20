const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

let io = null;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
    allowEIO3: true
  });

  // ═══════════════════════════════════════════
  // AUTHENTICATION MIDDLEWARE
  // ═══════════════════════════════════════════
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token ||
                    socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userName = decoded.name;
      socket.userRole = decoded.role;
      socket.userEmail = decoded.email;

      next();
    } catch (err) {
      logger.error(`Socket auth error: ${err.message}`);
      next(new Error('Invalid or expired token'));
    }
  });

  // ═══════════════════════════════════════════
  // CONNECTION HANDLER
  // ═══════════════════════════════════════════
  io.on('connection', (socket) => {
    logger.info(`🔌 User connected: ${socket.userName} (${socket.userId})`);

    // Join personal room for direct notifications
    socket.join(`user:${socket.userId}`);

    // ── PROJECT ROOM EVENTS ──
    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`);
      logger.info(`👤 ${socket.userName} joined project room: ${projectId}`);

      // Notify others in the project
      socket.to(`project:${projectId}`).emit('user-joined-project', {
        userId: socket.userId,
        userName: socket.userName,
        timestamp: new Date()
      });
    });

    socket.on('leave-project', (projectId) => {
      socket.leave(`project:${projectId}`);
      logger.info(`👤 ${socket.userName} left project room: ${projectId}`);

      socket.to(`project:${projectId}`).emit('user-left-project', {
        userId: socket.userId,
        userName: socket.userName,
        timestamp: new Date()
      });
    });

    // ── TASK EVENTS ──
    socket.on('task-updated', (data) => {
      socket.to(`project:${data.projectId}`).emit('task-changed', {
        ...data,
        updatedBy: socket.userName,
        timestamp: new Date()
      });
    });

    socket.on('task-moved', (data) => {
      socket.to(`project:${data.projectId}`).emit('task-status-changed', {
        ...data,
        movedBy: socket.userName,
        timestamp: new Date()
      });
    });

    socket.on('task-created', (data) => {
      socket.to(`project:${data.projectId}`).emit('new-task', {
        ...data,
        createdBy: socket.userName,
        timestamp: new Date()
      });
    });

    socket.on('task-assigned', (data) => {
      // Notify the assigned user directly
      io.to(`user:${data.assigneeId}`).emit('new-assignment', {
        ...data,
        assignedBy: socket.userName,
        timestamp: new Date()
      });

      // Notify project room
      socket.to(`project:${data.projectId}`).emit('task-changed', {
        ...data,
        timestamp: new Date()
      });
    });

    // ── CHAT EVENTS ──
    socket.on('send-message', (data) => {
      io.to(`project:${data.projectId}`).emit('new-message', {
        ...data,
        senderId: socket.userId,
        senderName: socket.userName,
        timestamp: new Date()
      });
    });

    socket.on('typing-start', (data) => {
      socket.to(`project:${data.projectId}`).emit('user-typing', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping: true
      });
    });

    socket.on('typing-stop', (data) => {
      socket.to(`project:${data.projectId}`).emit('user-typing', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping: false
      });
    });

    // ── NOTIFICATION EVENTS ──
    socket.on('send-notification', (data) => {
      io.to(`user:${data.targetUserId}`).emit('notification', {
        ...data,
        fromUser: socket.userName,
        timestamp: new Date()
      });
    });

    // ── PRESENCE ──
    socket.on('get-online-users', (projectId) => {
      const room = io.sockets.adapter.rooms.get(`project:${projectId}`);
      const onlineCount = room ? room.size : 0;
      socket.emit('online-users-count', { projectId, count: onlineCount });
    });

    // ── DISCONNECT ──
    socket.on('disconnect', (reason) => {
      logger.info(`🔌 User disconnected: ${socket.userName} (${reason})`);
    });

    // ── ERROR ──
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.userName}: ${error.message}`);
    });
  });

  logger.info('⚡ Socket.io initialized successfully');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initializeSocket first.');
  }
  return io;
};

// Emit to a specific project room
const emitToProject = (projectId, event, data) => {
  if (io) {
    io.to(`project:${projectId}`).emit(event, data);
  }
};

// Emit to a specific user
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitToProject,
  emitToUser
};