const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, AppError } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const sprintRoutes = require('./routes/sprintRoutes');
const aiRoutes = require('./routes/aiRoutes');
// ═══ Import Routes ═══
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const moodRoutes = require('./routes/moodRoutes');
const standupRoutes = require('./routes/standupRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');


const app = express();

// ═══════════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════════
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use('/api/', apiLimiter);

// ═══════════════════════════════════════════
// PARSING MIDDLEWARE
// ═══════════════════════════════════════════
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ═══════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
    })
  );
}

// ═══════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 WorkPulse AI API is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`
  });
});

// ═══════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/sprints', sprintRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/mood', moodRoutes);
app.use('/api/v1/standups', standupRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Future routes (Week 4+):
// app.use('/api/v1/projects', projectRoutes);
// app.use('/api/v1/tasks', taskRoutes);
// app.use('/api/v1/ai', aiRoutes);
// app.use('/api/v1/mood', moodRoutes);
// app.use('/api/v1/standups', standupRoutes);
// app.use('/api/v1/analytics', analyticsRoutes);
// app.use('/api/v1/notifications', notificationRoutes);
// app.use('/api/v1/chat', chatRoutes);

// API Info
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to WorkPulse AI API v1',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
        logout: 'POST /api/v1/auth/logout',
        me: 'GET /api/v1/auth/me',
        updateProfile: 'PUT /api/v1/auth/profile',
        changePassword: 'PUT /api/v1/auth/change-password',
        forgotPassword: 'POST /api/v1/auth/forgot-password',
        resetPassword: 'POST /api/v1/auth/reset-password/:token',
        refreshToken: 'POST /api/v1/auth/refresh-token'
      },
      users: {
        list: 'GET /api/v1/users',
        search: 'GET /api/v1/users/search?q=',
        getById: 'GET /api/v1/users/:id',
        updateRole: 'PUT /api/v1/users/:id/role',
        updateSkills: 'PUT /api/v1/users/skills'
      }
    }
  });
});

// ═══════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// ═══════════════════════════════════════════
// GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════
app.use(errorHandler);

module.exports = app;