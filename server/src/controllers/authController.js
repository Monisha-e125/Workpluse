const crypto = require('crypto');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const EmailService = require('../services/emailService');
const logger = require('../utils/logger');

// Cookie options
const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge
});

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
      firstName,
      lastName,
      email: email.toLowerCase(),
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
    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days
    res.cookie(
      'refreshToken',
      refreshToken,
      getCookieOptions(30 * 24 * 60 * 60 * 1000) // 30 days
    );

    // Send welcome email (async — don't block response)
    EmailService.sendWelcomeEmail(user);

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
    res.cookie(
      'refreshToken',
      refreshToken,
      getCookieOptions(30 * 24 * 60 * 60 * 1000)
    );

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
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });

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
    // Fields allowed to be updated
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

    // Build update object with only allowed fields
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Prevent empty update
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

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return ApiResponse.badRequest(res, 'Current password is incorrect');
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;

    // Invalidate all existing refresh tokens
    user.refreshToken = '';

    await user.save();

    // Generate new tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set new cookies
    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie(
      'refreshToken',
      refreshToken,
      getCookieOptions(30 * 24 * 60 * 60 * 1000)
    );

    // Send confirmation email
    EmailService.sendPasswordChangedEmail(user);

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

    // Don't reveal if email exists or not
    if (!user) {
      return ApiResponse.success(
        res,
        null,
        'If an account exists with this email, a password reset link has been sent.'
      );
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset email
    try {
      await EmailService.sendPasswordResetEmail(user, resetToken);
    } catch {
      // Clear the reset token if email fails
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

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
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

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = ''; // Invalidate all sessions

    await user.save();

    // Generate new tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    res.cookie('accessToken', accessToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.cookie(
      'refreshToken',
      refreshToken,
      getCookieOptions(30 * 24 * 60 * 60 * 1000)
    );

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
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return ApiResponse.unauthorized(res, 'Refresh token is required');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = require('jsonwebtoken').verify(
        token,
        process.env.JWT_REFRESH_SECRET
      );
    } catch {
      return ApiResponse.unauthorized(res, 'Invalid or expired refresh token');
    }

    // Find user and verify stored refresh token
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

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Set new cookies
    res.cookie(
      'accessToken',
      newAccessToken,
      getCookieOptions(7 * 24 * 60 * 60 * 1000)
    );
    res.cookie(
      'refreshToken',
      newRefreshToken,
      getCookieOptions(30 * 24 * 60 * 60 * 1000)
    );

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