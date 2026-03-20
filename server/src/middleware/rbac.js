const ApiResponse = require('../utils/apiResponse');
const { ROLE_HIERARCHY } = require('../config/constants');

/**
 * Role-Based Access Control Middleware
 * Restricts access to specific roles
 *
 * Usage:
 *   router.get('/admin', protect, authorize('admin'), controller)
 *   router.get('/manage', protect, authorize('admin', 'manager'), controller)
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user exists (protect middleware should run first)
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Please login first.');
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to perform this action. Required roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Minimum Role Level Authorization
 * Allows access to users at or above a certain role level
 *
 * Usage:
 *   router.get('/data', protect, minRole('manager'), controller)
 *   // Allows: admin (4), manager (3) — blocks: developer (2), viewer (1)
 */
const minRole = (minimumRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Please login first.');
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;

    if (userLevel < requiredLevel) {
      return ApiResponse.forbidden(
        res,
        `Access denied. Minimum role required: ${minimumRole}. Your role: ${req.user.role}`
      );
    }

    next();
  };
};

/**
 * Check if user is the resource owner OR has admin/manager role
 * Useful for "edit own profile" type operations
 *
 * Usage:
 *   router.put('/users/:id', protect, ownerOrAdmin, controller)
 */
const ownerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Please login first.');
  }

  const resourceUserId = req.params.id || req.params.userId;
  const isOwner = req.user._id.toString() === resourceUserId;
  const isAdmin = req.user.role === 'admin';
  const isManager = req.user.role === 'manager';

  if (!isOwner && !isAdmin && !isManager) {
    return ApiResponse.forbidden(
      res,
      'You can only perform this action on your own resource.'
    );
  }

  req.isOwner = isOwner;
  next();
};

module.exports = { authorize, minRole, ownerOrAdmin };