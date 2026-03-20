const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Protect routes — Verify JWT Access Token
 * Attaches user object to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Authorization header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2. Check if token exists
    if (!token) {
      return ApiResponse.unauthorized(
        res,
        'You are not logged in. Please login to access this resource.'
      );
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized(
          res,
          'Your session has expired. Please login again.'
        );
      }
      return ApiResponse.unauthorized(res, 'Invalid token. Please login again.');
    }

    // 4. Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+passwordChangedAt');

    if (!currentUser) {
      return ApiResponse.unauthorized(
        res,
        'The user belonging to this token no longer exists.'
      );
    }

    // 5. Check if user is active
    if (!currentUser.isActive) {
      return ApiResponse.unauthorized(
        res,
        'Your account has been deactivated. Please contact an administrator.'
      );
    }

    // 6. Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return ApiResponse.unauthorized(
        res,
        'Password was recently changed. Please login again.'
      );
    }

    // 7. Attach user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return ApiResponse.unauthorized(res, 'Authentication failed.');
  }
};

/**
 * Optional auth — doesn't fail if no token
 * Useful for public routes that show extra data for logged-in users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch {
    // Token invalid — continue without user
    next();
  }
};

module.exports = { protect, optionalAuth };