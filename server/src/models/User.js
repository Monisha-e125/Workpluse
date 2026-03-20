const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [1, 'First name must be at least 1 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [1, 'Last name must be at least 1 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [6, 'Password must be at least 6 characters'],  // ← Simpler
  select: false
},
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'manager', 'developer', 'viewer'],
        message: 'Role must be admin, manager, developer, or viewer'
      },
      default: 'developer'
    },
    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        proficiency: {
          type: Number,
          min: 1,
          max: 5,
          default: 3
        },
        lastUsed: {
          type: Date,
          default: Date.now
        },
        projectCount: {
          type: Number,
          default: 0
        }
      }
    ],
    department: {
      type: String,
      trim: true,
      default: ''
    },
    designation: {
      type: String,
      trim: true,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    workingHours: {
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' },
      timezone: { type: String, default: 'Asia/Kolkata' }
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    burnoutProfile: {
      currentRiskScore: { type: Number, default: 0, min: 0, max: 100 },
      riskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'LOW'
      },
      lastPTODate: { type: Date },
      consecutiveOvertimeDays: { type: Number, default: 0 },
      lastBurnoutCheck: { type: Date }
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true },
      moodReminder: { type: Boolean, default: true },
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' }
    },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordChangedAt: { type: Date, select: false }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ═══════════════════════════════════════════
// VIRTUAL FIELDS
// ═══════════════════════════════════════════

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('initials').get(function () {
  return `${this.firstName?.[0] || ''}${this.lastName?.[0] || ''}`.toUpperCase();
});

// ═══════════════════════════════════════════
// INDEXES
// ═══════════════════════════════════════════

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ 'skills.name': 1 });

// ═══════════════════════════════════════════
// PRE-SAVE MIDDLEWARE
// ═══════════════════════════════════════════

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Set passwordChangedAt (skip on new user creation)
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // subtract 1s for token timing
    }

    next();
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════
// INSTANCE METHODS
// ═══════════════════════════════════════════

/**
 * Compare candidate password with stored hashed password
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate JWT Access Token
 */
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      name: this.fullName,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Generate JWT Refresh Token
 */
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

/**
 * Generate Password Reset Token
 */
UserSchema.methods.generatePasswordResetToken = function () {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash and store in DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return unhashed token (sent via email)
  return resetToken;
};

/**
 * Generate Email Verification Token
 */
UserSchema.methods.generateEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

/**
 * Check if password was changed after token was issued
 */
UserSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};

/**
 * Return safe user object (without sensitive fields)
 */
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  delete obj.passwordChangedAt;
  delete obj.__v;
  return obj;
};

// ═══════════════════════════════════════════
// STATIC METHODS
// ═══════════════════════════════════════════

/**
 * Find user by email (include password for auth)
 */
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

/**
 * Find active users by role
 */
UserSchema.statics.findByRole = function (role) {
  return this.find({ role, isActive: true });
};

module.exports = mongoose.model('User', UserSchema);