const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');

// ═══ CREATE SPRINT ═══
exports.createSprint = async (req, res) => {
  try {
    const { name, goal, startDate, endDate } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) return ApiResponse.notFound(res, 'Project not found');

    const sprint = {
      name,
      goal: goal || '',
      startDate,
      endDate,
      status: 'planning',
      velocity: 0
    };

    project.sprints.push(sprint);
    await project.save();

    const newSprint = project.sprints[project.sprints.length - 1];
    return ApiResponse.created(res, newSprint, 'Sprint created');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET SPRINTS ═══
exports.getSprints = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return ApiResponse.notFound(res, 'Project not found');

    return ApiResponse.success(res, project.sprints);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ START SPRINT ═══
exports.startSprint = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return ApiResponse.notFound(res, 'Project not found');

    const activeSprint = project.sprints.find((s) => s.status === 'active');
    if (activeSprint) {
      return ApiResponse.badRequest(res, 'Another sprint is already active');
    }

    const sprint = project.sprints.id(req.params.sprintId);
    if (!sprint) return ApiResponse.notFound(res, 'Sprint not found');

    sprint.status = 'active';
    sprint.startDate = sprint.startDate || new Date();
    project.activeSprint = sprint._id;

    await project.save();
    return ApiResponse.success(res, sprint, 'Sprint started');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ COMPLETE SPRINT ═══
exports.completeSprint = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return ApiResponse.notFound(res, 'Project not found');

    const sprint = project.sprints.id(req.params.sprintId);
    if (!sprint) return ApiResponse.notFound(res, 'Sprint not found');

    sprint.status = 'completed';
    sprint.endDate = new Date();
    project.activeSprint = null;

    await project.save();
    return ApiResponse.success(res, sprint, 'Sprint completed');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};