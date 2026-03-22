const crypto = require('crypto');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const EmailService = require('../services/emailService');
const logger = require('../utils/logger');

// ═══════════════════════════════════════════
// ✅ FIXED COOKIE OPTIONS FOR CROSS-DOMAIN
// ═══════════════════════════════════════════
const getCookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction, // true in production (HTTPS)
    sameSite: isProduction ? 'none' : 'lax', // ✅ 'none' for cross-domain (Vercel↔Render)
    maxAge,
    path: '/'
  };
};

// ═══════════════════════════════════════════
// REGISTER
// ═══════════════════════════════════════════
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, skills } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return ApiResponse.conflict(res, 'An account with this email already exists');
    }

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'developer',
      skills: skills || []
    });

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.loginCount = 1;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    // Send welcome email (async — don't block response)
    try {
      EmailService.sendWelcomeEmail(user);
    } catch (emailErr) {
      logger.warn(`Welcome email failed for ${email}: ${emailErr.message}`);
    }

    // Get safe user object
    const safeUser = user.toSafeObject();

    logger.info(`✅ New user registered: ${email} (${role || 'developer'})`);

    return ApiResponse.created(
      res,
      {
        user: safeUser,
        accessToken,
        refreshToken
      },
      'Registration successful! Welcome to WorkPulse AI.'
    );
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);

    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      return ApiResponse.conflict(res, 'An account with this email already exists');
    }

    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findByEmail(email);

    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      return ApiResponse.unauthorized(
        res,
        'Your account has been deactivated. Please contact an administrator.'
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update user
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    const safeUser = user.toSafeObject();

    logger.info(`✅ User logged in: ${email}`);

    return ApiResponse.success(
      res,
      {
        user: safeUser,
        accessToken,
        refreshToken
      },
      'Login successful!'
    );
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// LOGOUT
// ═══════════════════════════════════════════
exports.logout = async (req, res) => {
  try {
    // Clear refresh token in database
    await User.findByIdAndUpdate(req.user._id, {
      refreshToken: ''
    });

    // Clear cookies
    res.cookie('accessToken', '', { ...getCookieOptions(0), maxAge: 0 });
    res.cookie('refreshToken', '', { ...getCookieOptions(0), maxAge: 0 });

    logger.info(`✅ User logged out: ${req.user.email}`);

    return ApiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// GET CURRENT USER (ME)
// ═══════════════════════════════════════════
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    return ApiResponse.success(res, user.toSafeObject(), 'Profile fetched successfully');
  } catch (error) {
    logger.error(`Get me error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// UPDATE PROFILE
// ═══════════════════════════════════════════
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'avatar',
      'bio',
      'phone',
      'location',
      'department',
      'designation',
      'skills',
      'workingHours',
      'socialLinks',
      'preferences'
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return ApiResponse.badRequest(res, 'No valid fields to update');
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    logger.info(`✅ Profile updated: ${user.email}`);

    return ApiResponse.success(
      res,
      user.toSafeObject(),
      'Profile updated successfully'
    );
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// CHANGE PASSWORD
// ═══════════════════════════════════════════
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return ApiResponse.badRequest(res, 'Current password is incorrect');
    }

    user.password = newPassword;
    user.refreshToken = '';
    await user.save();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    try {
      EmailService.sendPasswordChangedEmail(user);
    } catch (emailErr) {
      logger.warn(`Password changed email failed: ${emailErr.message}`);
    }

    logger.info(`✅ Password changed: ${user.email}`);

    return ApiResponse.success(
      res,
      { accessToken, refreshToken },
      'Password changed successfully. All other sessions have been logged out.'
    );
  } catch (error) {
    logger.error(`Change password error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// FORGOT PASSWORD
// ═══════════════════════════════════════════
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return ApiResponse.success(
        res,
        null,
        'If an account exists with this email, a password reset link has been sent.'
      );
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await EmailService.sendPasswordResetEmail(user, resetToken);
    } catch {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return ApiResponse.error(
        res,
        'Failed to send reset email. Please try again later.'
      );
    }

    logger.info(`✅ Password reset email sent to: ${email}`);

    return ApiResponse.success(
      res,
      null,
      'If an account exists with this email, a password reset link has been sent.'
    );
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    return ApiResponse.error(res, error.message);
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
      return ApiResponse.badRequest(
        res,
        'Password reset token is invalid or has expired'
      );
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = '';
    await user.save();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    logger.info(`✅ Password reset successful: ${user.email}`);

    return ApiResponse.success(
      res,
      {
        user: user.toSafeObject(),
        accessToken,
        refreshToken
      },
      'Password reset successful!'
    );
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    return ApiResponse.error(res, error.message);
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

    let decoded;
    try {
      decoded = require('jsonwebtoken').verify(
        token,
        process.env.JWT_REFRESH_SECRET
      );
    } catch {
      return ApiResponse.unauthorized(res, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return ApiResponse.unauthorized(
        res,
        'Invalid refresh token. Please login again.'
      );
    }

    if (!user.isActive) {
      return ApiResponse.unauthorized(res, 'Account has been deactivated');
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', newAccessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie('refreshToken', newRefreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

    return ApiResponse.success(
      res,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      },
      'Token refreshed successfully'
    );
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    return ApiResponse.unauthorized(res, 'Token refresh failed');
  }
};