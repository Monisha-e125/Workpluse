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
// ✅ CORS CONFIG — Fixed for cross-domain cookies
// ═══════════════════════════════════════════
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://workpluse.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Refresh-Token']
  })
);

// ✅ Handle preflight
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
// ✅ ROOT ROUTE
// ═══════════════════════════════════════════
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 WorkPulse AI API is running!',
    version: '1.0.0'
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

// API Info
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to WorkPulse AI API v1',
    version: '1.0.0'
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