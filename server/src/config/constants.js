module.exports = {
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,       // 15 minutes
    MAX_REQUESTS: 100,                 // 100 requests per window
    AUTH_WINDOW_MS: 60 * 60 * 1000,   // 1 hour
    AUTH_MAX_REQUESTS: 20              // 20 auth attempts per hour
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  USER_ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    DEVELOPER: 'developer',
    VIEWER: 'viewer'
  },

  TOKEN_EXPIRY: {
    ACCESS: '7d',
    REFRESH: '30d',
    PASSWORD_RESET: 10 * 60 * 1000,     // 10 minutes
    EMAIL_VERIFICATION: 24 * 60 * 60 * 1000  // 24 hours
  }
};