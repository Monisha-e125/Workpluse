const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, parseSort } = require('../utils/pagination');
const logger = require('../utils/logger');

// ═══════════════════════════════════════════
// GET ALL USERS
// ═══════════════════════════════════════════
exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const sort = parseSort(req.query.sort, '-createdAt');

    // Build filter
    const conditions = [];

    // Role filter
    if (req.query.role) {
      conditions.push({ role: req.query.role });
    }

    // Active filter
    if (req.query.isActive !== undefined) {
      conditions.push({ isActive: req.query.isActive === 'true' });
    }

    // Search filter
    if (req.query.search && req.query.search.trim().length > 0) {
      const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
      conditions.push({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { department: searchRegex },
          { designation: searchRegex }
        ]
      });
    }

    // Skill filter
    if (req.query.skill) {
      conditions.push({
        'skills.name': { $regex: req.query.skill, $options: 'i' }
      });
    }

    // Department filter
    if (req.query.department) {
      conditions.push({
        department: { $regex: req.query.department, $options: 'i' }
      });
    }

    // Build final filter
    const filter = conditions.length > 0 ? { $and: conditions } : {};

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v -refreshToken -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires -passwordChangedAt');

    return ApiResponse.paginated(res, users, page, limit, total, 'Users fetched');
  } catch (error) {
    logger.error(`Get users error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// GET USER BY ID
// ═══════════════════════════════════════════
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v -refreshToken -passwordResetToken -passwordResetExpires');

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    return ApiResponse.success(res, user, 'User fetched successfully');
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// UPDATE USER ROLE (Admin only)
// ═══════════════════════════════════════════
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (id === req.user._id.toString()) {
      return ApiResponse.badRequest(res, 'You cannot change your own role');
    }

    const validRoles = ['admin', 'manager', 'developer', 'viewer'];
    if (!validRoles.includes(role)) {
      return ApiResponse.badRequest(res, 'Invalid role specified');
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) return ApiResponse.notFound(res, 'User not found');

    logger.info(`✅ User role updated: ${user.email} → ${role}`);
    return ApiResponse.success(res, user, `User role updated to ${role}`);
  } catch (error) {
    logger.error(`Update role error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// DEACTIVATE USER (Admin only)
// ═══════════════════════════════════════════
exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return ApiResponse.badRequest(res, 'You cannot deactivate your own account');
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false, refreshToken: '' },
      { new: true }
    );

    if (!user) return ApiResponse.notFound(res, 'User not found');

    return ApiResponse.success(res, user, 'User account deactivated');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// ACTIVATE USER (Admin only)
// ═══════════════════════════════════════════
exports.activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!user) return ApiResponse.notFound(res, 'User not found');

    return ApiResponse.success(res, user, 'User account activated');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// UPDATE USER SKILLS
// ═══════════════════════════════════════════
exports.updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return ApiResponse.badRequest(res, 'Skills must be an array');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills },
      { new: true, runValidators: true }
    );

    return ApiResponse.success(res, user, 'Skills updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// SEARCH USERS
// ═══════════════════════════════════════════
exports.searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 1) {
      return ApiResponse.success(res, [], 'Search results');
    }

    const searchRegex = { $regex: q.trim(), $options: 'i' };

    const users = await User.find({
      isActive: true,
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ]
    })
      .select('firstName lastName email avatar role department skills')
      .limit(parseInt(limit));

    return ApiResponse.success(res, users, 'Search results');
  } catch (error) {
    logger.error(`Search users error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══════════════════════════════════════════
// GET USER STATS
// ═══════════════════════════════════════════
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const roleBreakdown = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return ApiResponse.success(res, {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      roleBreakdown: roleBreakdown.map((r) => ({
        role: r._id,
        count: r.count
      }))
    });
  } catch (error) {
    logger.error(`User stats error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};