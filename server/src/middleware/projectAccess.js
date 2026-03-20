const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');

/**
 * Check if user is a member of the project
 */
const checkProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id || req.body.project;

    if (!projectId) {
      return ApiResponse.badRequest(res, 'Project ID is required');
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return ApiResponse.notFound(res, 'Project not found');
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !member && !isAdmin) {
      return ApiResponse.forbidden(res, 'You are not a member of this project');
    }

    req.project = project;
    req.projectRole = isOwner ? 'owner' : member?.role || 'admin';
    next();
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

/**
 * Check if user can edit project (owner, lead, or admin)
 */
const checkProjectEditor = async (req, res, next) => {
  try {
    await checkProjectMember(req, res, () => {
      const canEdit = ['owner', 'lead', 'admin'].includes(req.projectRole);
      if (!canEdit) {
        return ApiResponse.forbidden(res, 'You do not have edit permission');
      }
      next();
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = { checkProjectMember, checkProjectEditor };