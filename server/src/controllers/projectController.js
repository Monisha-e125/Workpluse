const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, parseSort } = require('../utils/pagination');
const { logActivity } = require('../middleware/activityLogger');
const { generateRandomColor } = require('../utils/helpers');
const logger = require('../utils/logger');
// ADD this import at the top:
const NotificationService = require('../services/notificationService');

// ═══ CREATE PROJECT ═══
exports.createProject = async (req, res) => {
  try {
    const { name, description, color, icon, tags } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      color: color || generateRandomColor(),
      icon: icon || '📁',
      tags: tags || [],
      members: [
        {
          user: req.user._id,
          role: 'lead',
          joinedAt: new Date()
        }
      ]
    });

    await project.populate([
      { path: 'owner', select: 'firstName lastName avatar email' },
      { path: 'members.user', select: 'firstName lastName avatar email role' }
    ]);

    logActivity({
      userId: req.user._id,
      projectId: project._id,
      action: 'project-created',
      details: { projectName: name }
    });

    logger.info(`✅ Project created: ${name} by ${req.user.email}`);
    return ApiResponse.created(res, project, 'Project created successfully');
  } catch (error) {
    logger.error(`Create project error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET ALL PROJECTS (user's projects) ═══
exports.getProjects = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const sort = parseSort(req.query.sort, '-createdAt');

    const filter = {
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$and = [
        { $or: filter.$or },
        {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { key: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      ];
      delete filter.$or;
    }

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .populate('owner', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return ApiResponse.paginated(res, projects, page, limit, total);
  } catch (error) {
    logger.error(`Get projects error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET PROJECT BY ID ═══
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'firstName lastName avatar email role')
      .populate('members.user', 'firstName lastName avatar email role skills department');

    if (!project) return ApiResponse.notFound(res, 'Project not found');

    return ApiResponse.success(res, project);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ UPDATE PROJECT ═══
exports.updateProject = async (req, res) => {
  try {
    const allowed = ['name', 'description', 'status', 'color', 'icon', 'tags', 'settings'];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    })
      .populate('owner', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar');

    if (!project) return ApiResponse.notFound(res, 'Project not found');

    return ApiResponse.success(res, project, 'Project updated');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ DELETE PROJECT ═══
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return ApiResponse.notFound(res, 'Project not found');

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, 'Only project owner can delete');
    }

    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(req.params.id);

    return ApiResponse.success(res, null, 'Project deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ ADD MEMBER ═══
exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return ApiResponse.notFound(res, 'Project not found');

    const user = await User.findById(userId);
    if (!user) return ApiResponse.notFound(res, 'User not found');

    const exists = project.members.find(
      (m) => m.user.toString() === userId
    );
    if (exists) return ApiResponse.conflict(res, 'User already a member');

    project.members.push({ user: userId, role: role || 'member', joinedAt: new Date() });
    await project.save();

    await project.populate('members.user', 'firstName lastName avatar email role');

    logActivity({
      userId: req.user._id,
      projectId: project._id,
      action: 'member-added',
      details: { addedUser: userId }
    });

    // ✅ NOTIFICATION: Member added
    await NotificationService.memberAdded({
      project,
      addedUserId: userId,
      addedBy: req.user
    });

    return ApiResponse.success(res, project, 'Member added');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
// ═══ REMOVE MEMBER ═══
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return ApiResponse.notFound(res, 'Project not found');

    if (project.owner.toString() === req.params.userId) {
      return ApiResponse.badRequest(res, 'Cannot remove project owner');
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );
    await project.save();

    await project.populate('members.user', 'firstName lastName avatar email');

    // ✅ NOTIFICATION: Member removed
    await NotificationService.memberRemoved({
      project,
      removedUserId: req.params.userId,
      removedBy: req.user
    });

    return ApiResponse.success(res, project, 'Member removed');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
// ═══ GET PROJECT MEMBERS ═══
exports.getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate(
        'members.user',
        'firstName lastName avatar email role skills department'
      )
      .populate('owner', 'firstName lastName avatar email role');

    if (!project) return ApiResponse.notFound(res, 'Project not found');

    // Flatten members for easy frontend use
    const members = project.members
      .filter((m) => m.user) // Filter out null users
      .map((m) => ({
        _id: m.user._id,
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        email: m.user.email,
        avatar: m.user.avatar,
        role: m.user.role,
        projectRole: m.role,
        joinedAt: m.joinedAt,
        isOwner: m.user._id.toString() === project.owner?._id?.toString()
      }));

    return ApiResponse.success(res, members);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};