const logger = require('../utils/logger');

/**
 * Custom Application Error Class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // ── MongoDB Duplicate Key Error ──
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `Duplicate value: '${value}' already exists for field '${field}'`;
  }

  // ── MongoDB Validation Error ──
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
    message = 'Validation failed';
  }

  // ── MongoDB CastError (Invalid ObjectId) ──
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── JWT Errors ──
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please login again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please login again.';
  }

  // ── Multer File Upload Errors ──
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Maximum size allowed is 10MB.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field.';
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // ── SyntaxError (Invalid JSON) ──
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON format in request body';
  }

  // ── Log the error ──
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message} - ${req.method} ${req.originalUrl}`);
    if (err.stack) {
      logger.error(err.stack);
    }
  } else {
    logger.warn(`${statusCode} - ${message} - ${req.method} ${req.originalUrl}`);
  }

  // ── Send Response ──
  const response = {
    success: false,
    status: err.status || 'error',
    message,
    timestamp: new Date().toISOString()
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    if (errors) response.errors = errors;
  }

  // Include validation errors in production too
  if (errors && process.env.NODE_ENV === 'production') {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = { AppError, errorHandler };