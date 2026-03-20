const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../config/constants');

/**
 * General API Rate Limiter
 * 100 requests per 15 minutes
 */
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
    retryAfter: '15 minutes'
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  }
});

/**
 * Auth Rate Limiter (stricter)
 * 10 requests per hour for login/register
 */
const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
  max: RATE_LIMIT.AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 1 hour.',
    retryAfter: '1 hour'
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
  skipSuccessfulRequests: true // Only count failed attempts
});

/**
 * Password Reset Rate Limiter
 * 3 requests per hour
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again after 1 hour.',
    retryAfter: '1 hour'
  }
});

/**
 * File Upload Rate Limiter
 * 20 uploads per hour
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Upload limit reached. Please try again after 1 hour.',
    retryAfter: '1 hour'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter
};