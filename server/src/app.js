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

// ═══════════════════════════════════════════
// ✅ FIXED CORS CONFIG
// ═══════════════════════════════════════════
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://workpluse.vercel.app',
  'https://www.workpluse.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// ✅ Handle preflight requests explicitly
app.options('*', cors());

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
// ✅ ROOT ROUTE (MOVED HERE — BEFORE 404 HANDLER)
// ═══════════════════════════════════════════
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 WorkPulse AI API is running successfully!',
    version: '1.0.0',
    docs: '/api/v1',
    health: '/api/health'
  });
});

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
// API ROUTES — all under /api/v1
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

// API Info
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to WorkPulse AI API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      projects: '/api/v1/projects',
      tasks: '/api/v1/tasks',
      sprints: '/api/v1/sprints',
      chat: '/api/v1/chat',
      notifications: '/api/v1/notifications',
      ai: '/api/v1/ai',
      mood: '/api/v1/mood',
      standups: '/api/v1/standups',
      analytics: '/api/v1/analytics'
    }
  });
});

// ═══════════════════════════════════════════
// 404 HANDLER (must be LAST route)
// ═══════════════════════════════════════════
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// ═══════════════════════════════════════════
// GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════
app.use(errorHandler);

module.exports = app;