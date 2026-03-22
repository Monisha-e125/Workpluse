const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

// ═══════════════════════════════════════════
// ✅ Safe EmailService import — NEVER crashes
// ═══════════════════════════════════════════
let EmailService;
try {
  EmailService = require('../services/emailService');
  logger.info('✅ EmailService loaded');
} catch (error) {
  logger.warn(`⚠️ EmailService not available: ${error.message}`);
  EmailService = {
    sendWelcomeEmail: async () => logger.info('📧 [SKIP] Welcome email'),
    sendPasswordResetEmail: async () => logger.info('📧 [SKIP] Reset email'),
    sendPasswordChangedEmail: async () => logger.info('📧 [SKIP] Password changed email')
  };
}

// ═══════════════════════════════════════════
// ✅ Cookie options for cross-domain (Vercel ↔ Render)
// ═══════════════════════════════════════════
const getCookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge,
    path: '/'
  };
};

// ═══════════════════════════════════════════
// ✅ Safe token generator — catches missing secrets
// ═══════════════════════════════════════════
const generateTokens = (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  if (!jwtRefreshSecret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is not set');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return { accessToken, refreshToken };
};

// ═══════════════════════════════════════════
// REGISTER
// ═══════════════════════════════════════════
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, skills } = req.body;

    logger.info(`📝 Register attempt: ${email}`);

    // Validate required fields manually (backup for validator)
    if (!firstName || !lastName || !email || !password) {
      return ApiResponse.badRequest(res, 'First name, last name, email, and password are required');
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      logger.warn(`⚠️ Registration conflict — email exists: ${email}`);
      return ApiResponse.conflict(res, 'An account with this email already exists');
    }

    // Create user
    let user;
    try {
      user = await User.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: role || 'developer',
        skills: skills || []
      });
      logger.info(`✅ User created in DB: ${email}`);
    } catch (createError) {
      logger.error(`❌ User creation failed: ${createError.message}`);

      if (createError.code === 11000) {
        return ApiResponse.conflict(res, 'An account with this email already exists');
      }
      if (createError.name === 'ValidationError') {
        const messages = Object.values(createError.errors).map((e) => e.message);
        return ApiResponse.badRequest(res, messages.join('. '));
      }
      throw createError;
    }

    // Generate tokens
    let accessToken, refreshToken;
    try {
      const tokens = generateTokens(user);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
      logger.info(`✅ Tokens generated for: ${email}`);
    } catch (tokenError) {
      logger.error(`❌ Token generation failed: ${tokenError.message}`);
      // Delete the user since we can't complete registration
      await User.findByIdAndDelete(user._id);
      return ApiResponse.error(res, 'Server configuration error. Please contact admin.');
    }

    // Save refresh token
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.loginCount = 1;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    // Send welcome email — fire and forget
    try {
      if (EmailService && EmailService.sendWelcomeEmail) {
        EmailService.sendWelcomeEmail(user).catch((err) =>
          logger.warn(`⚠️ Welcome email async error: ${err.message}`)
        );
      }
    } catch (emailErr) {
      logger.warn(`⚠️ Email service error: ${emailErr.message}`);
    }

    const safeUser = user.toSafeObject();

    logger.info(`✅ Registration complete: ${email}`);

    return ApiResponse.created(
      res,
      { user: safeUser, accessToken, refreshToken },
      'Registration successful! Welcome to WorkPulse AI.'
    );
  } catch (error) {
    logger.error(`❌ Registration error: ${error.message}`);
    logger.error(`❌ Stack: ${error.stack}`);
    return ApiResponse.error(res, 'Registration failed. Please try again.');
  }
};

// ═══════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info(`🔐 Login attempt: ${email}`);

    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Email and password are required');
    }

    // Find user with password
    const user = await User.findByEmail(email);

    if (!user) {
      logger.warn(`❌ Login failed — user not found: ${email}`);
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Check active
    if (!user.isActive) {
      return ApiResponse.unauthorized(res, 'Your account has been deactivated.');
    }

    // Verify password
    let isPasswordValid;
    try {
      isPasswordValid = await user.comparePassword(password);
    } catch (compareErr) {
      logger.error(`❌ Password compare error: ${compareErr.message}`);
      return ApiResponse.error(res, 'Login failed. Please try again.');
    }

    if (!isPasswordValid) {
      logger.warn(`❌ Login failed — wrong password: ${email}`);
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Generate tokens
    let accessToken, refreshToken;
    try {
      const tokens = generateTokens(user);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    } catch (tokenError) {
      logger.error(`❌ Token generation failed: ${tokenError.message}`);
      return ApiResponse.error(res, 'Server configuration error. Please contact admin.');
    }

    // Update user
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    const safeUser = user.toSafeObject();

    logger.info(`✅ Login successful: ${email}`);

    return ApiResponse.success(
      res,
      { user: safeUser, accessToken, refreshToken },
      'Login successful!'
    );
  } catch (error) {
    logger.error(`❌ Login error: ${error.message}`);
    logger.error(`❌ Stack: ${error.stack}`);
    return ApiResponse.error(res, 'Login failed. Please try again.');
  }
};

// ═══════════════════════════════════════════
// LOGOUT
// ═══════════════════════════════════════════
exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });

    res.cookie('accessToken', '', { ...getCookieOptions(0), maxAge: 0 });
    res.cookie('refreshToken', '', { ...getCookieOptions(0), maxAge: 0 });

    logger.info(`✅ User logged out: ${req.user.email}`);
    return ApiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    return ApiResponse.error(res, 'Logout failed');
  }
};

// ═══════════════════════════════════════════
// GET ME
// ═══════════════════════════════════════════
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return ApiResponse.notFound(res, 'User not found');
    return ApiResponse.success(res, user.toSafeObject(), 'Profile fetched successfully');
  } catch (error) {
    logger.error(`Get me error: ${error.message}`);
    return ApiResponse.error(res, 'Failed to fetch profile');
  }
};

// ═══════════════════════════════════════════
// UPDATE PROFILE
// ═══════════════════════════════════════════
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'avatar', 'bio', 'phone',
      'location', 'department', 'designation', 'skills',
      'workingHours', 'socialLinks', 'preferences'
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return ApiResponse.badRequest(res, 'No valid fields to update');
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    if (!user) return ApiResponse.notFound(res, 'User not found');

    logger.info(`✅ Profile updated: ${user.email}`);
    return ApiResponse.success(res, user.toSafeObject(), 'Profile updated successfully');
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    return ApiResponse.error(res, 'Failed to update profile');
  }
};

// ═══════════════════════════════════════════
// CHANGE PASSWORD
// ═══════════════════════════════════════════
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return ApiResponse.notFound(res, 'User not found');

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) return ApiResponse.badRequest(res, 'Current password is incorrect');

    user.password = newPassword;
    user.refreshToken = '';
    await user.save();

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', tokens.accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    try {
      EmailService.sendPasswordChangedEmail(user);
    } catch (e) {
      logger.warn(`Password change email failed: ${e.message}`);
    }

    logger.info(`✅ Password changed: ${user.email}`);
    return ApiResponse.success(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }, 'Password changed successfully.');
  } catch (error) {
    logger.error(`Change password error: ${error.message}`);
    return ApiResponse.error(res, 'Failed to change password');
  }
};

// ═══════════════════════════════════════════
// FORGOT PASSWORD
// ═══════════════════════════════════════════
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return same message (security)
    const successMsg = 'If an account exists with this email, a password reset link has been sent.';

    if (!user) {
      return ApiResponse.success(res, null, successMsg);
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await EmailService.sendPasswordResetEmail(user, resetToken);
    } catch {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return ApiResponse.error(res, 'Failed to send reset email. Please try again.');
    }

    logger.info(`✅ Password reset email sent to: ${email}`);
    return ApiResponse.success(res, null, successMsg);
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    return ApiResponse.error(res, 'Failed to process request');
  }
};

// ═══════════════════════════════════════════
// RESET PASSWORD
// ═══════════════════════════════════════════
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return ApiResponse.badRequest(res, 'Token is invalid or has expired');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = '';
    await user.save();

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', tokens.accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    logger.info(`✅ Password reset successful: ${user.email}`);

    return ApiResponse.success(res, {
      user: user.toSafeObject(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }, 'Password reset successful!');
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    return ApiResponse.error(res, 'Failed to reset password');
  }
};

// ═══════════════════════════════════════════
// REFRESH TOKEN
// ═══════════════════════════════════════════
exports.refreshToken = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      req.headers?.['x-refresh-token'];

    if (!token) {
      return ApiResponse.unauthorized(res, 'Refresh token is required');
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      logger.error('❌ JWT_REFRESH_SECRET not set!');
      return ApiResponse.error(res, 'Server configuration error');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return ApiResponse.unauthorized(res, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return ApiResponse.unauthorized(res, 'Invalid refresh token. Please login again.');
    }

    if (!user.isActive) {
      return ApiResponse.unauthorized(res, 'Account has been deactivated');
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', tokens.accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    return ApiResponse.success(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }, 'Token refreshed successfully');
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    return ApiResponse.unauthorized(res, 'Token refresh failed');
  }
};