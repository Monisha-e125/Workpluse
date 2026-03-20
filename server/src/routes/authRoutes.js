const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
  updateProfileRules
} = require('../validators/authValidator');

// ═══ Public Routes ═══
router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordRules, validate, resetPassword);
router.post('/refresh-token', refreshToken);

// ═══ Protected Routes ═══
router.use(protect); // All routes below require authentication

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfileRules, validate, updateProfile);
router.put('/change-password', changePasswordRules, validate, changePassword);

module.exports = router;