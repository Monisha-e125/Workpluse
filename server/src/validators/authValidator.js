const { body } = require('express-validator');

// ═══════════════════════════════════════════
// REGISTER VALIDATION RULES
// ═══════════════════════════════════════════
const registerRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens and apostrophes'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens and apostrophes'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  // ✅ confirmPassword is optional — frontend sends it but backend ignores it
  body('confirmPassword')
    .optional(),

  body('role')
    .optional()
    .isIn(['admin', 'manager', 'developer', 'viewer'])
    .withMessage('Role must be admin, manager, developer, or viewer'),

  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array')
];

// ═══════════════════════════════════════════
// LOGIN VALIDATION RULES
// ═══════════════════════════════════════════
const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// ═══════════════════════════════════════════
// FORGOT PASSWORD RULES
// ═══════════════════════════════════════════
const forgotPasswordRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
];

// ═══════════════════════════════════════════
// RESET PASSWORD RULES
// ═══════════════════════════════════════════
const resetPasswordRules = [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// ═══════════════════════════════════════════
// CHANGE PASSWORD RULES
// ═══════════════════════════════════════════
const changePasswordRules = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

// ═══════════════════════════════════════════
// UPDATE PROFILE RULES
// ═══════════════════════════════════════════
const updateProfileRules = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),

  body('bio')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Bio cannot exceed 300 characters'),

  body('phone')
    .optional()
    .trim(),

  body('location')
    .optional()
    .trim(),

  body('department')
    .optional()
    .trim(),

  body('designation')
    .optional()
    .trim()
];

module.exports = {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
  updateProfileRules
};