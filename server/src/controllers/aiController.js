const { WorkloadBalancer, BurnoutDetector, SkillMatcher, SprintPredictor } = require('../services/aiEngine');
const Project = require('../models/Project');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const NotificationService = require('../services/notificationService');
const logger = require('../utils/logger');

// ═══ AI AUTO-ASSIGN TASK ═══
exports.autoAssignTask = async (req, res) => {
  try {
    const { taskId, projectId } = req.body;

    if (!taskId || !projectId) {
      return ApiResponse.badRequest(res, 'taskId and projectId are required');
    }

    const result = await WorkloadBalancer.autoAssignTask(taskId, projectId);

    // Notify assigned user
    if (result.assignedTo) {
      await NotificationService.send({
        recipientId: result.assignedTo._id,
        senderId: req.user._id,
        type: 'ai-suggestion',
        title: 'AI Task Assignment',
        message: `AI assigned you "${result.task.title}" (${Math.round(result.matchScore * 100)}% match)`,
        link: `/projects/${projectId}`,
        projectId,
        taskId
      });
    }

    logger.info(`🧠 AI assigned task ${taskId} to ${result.assignedTo.name}`);
    return ApiResponse.success(res, result, 'Task auto-assigned by AI');
  } catch (error) {
    logger.error(`AI assign error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET WORKLOAD ANALYSIS ═══
exports.getWorkloadAnalysis = async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await WorkloadBalancer.getTeamWorkload(projectId);
    return ApiResponse.success(res, result);
  } catch (error) {
    logger.error(`Workload analysis error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET BURNOUT RISK ═══
exports.getBurnoutRisk = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await BurnoutDetector.calculateBurnoutRisk(userId);
    return ApiResponse.success(res, result);
  } catch (error) {
    logger.error(`Burnout risk error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET TEAM BURNOUT OVERVIEW ═══
exports.getTeamBurnout = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate(
      'members.user', 'firstName lastName avatar burnoutProfile'
    );

    if (!project) return ApiResponse.notFound(res, 'Project not found');

    const burnoutData = await Promise.all(
      project.members.map(async (m) => {
        if (!m.user) return null;
        try {
          return await BurnoutDetector.calculateBurnoutRisk(m.user._id);
        } catch {
          return {
            userId: m.user._id,
            userName: `${m.user.firstName} ${m.user.lastName}`,
            avatar: m.user.avatar,
            riskScore: 0,
            riskLevel: 'LOW',
            factors: [],
            recommendations: []
          };
        }
      })
    );

    const validData = burnoutData.filter(Boolean);
    const avgRisk = validData.length > 0
      ? Math.round(validData.reduce((s, d) => s + d.riskScore, 0) / validData.length)
      : 0;

    return ApiResponse.success(res, {
      team: validData,
      summary: {
        avgRiskScore: avgRisk,
        criticalCount: validData.filter((d) => d.riskLevel === 'CRITICAL').length,
        highCount: validData.filter((d) => d.riskLevel === 'HIGH').length,
        mediumCount: validData.filter((d) => d.riskLevel === 'MEDIUM').length,
        lowCount: validData.filter((d) => d.riskLevel === 'LOW').length,
        totalMembers: validData.length
      }
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET SKILL MATCH ═══
exports.getSkillMatch = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { skills } = req.query;

    const project = await Project.findById(projectId).populate(
      'members.user', 'firstName lastName avatar skills'
    );

    if (!project) return ApiResponse.notFound(res, 'Project not found');

    const requiredSkills = skills
      ? skills.split(',').map((s) => ({ name: s.trim(), weight: 0.5 }))
      : [];

    const developers = project.members.map((m) => m.user).filter(Boolean);
    const matches = SkillMatcher.findBestMatches(developers, requiredSkills);

    return ApiResponse.success(res, matches);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ SPRINT PREDICTION ═══
exports.getSprintPrediction = async (req, res) => {
  try {
    const { projectId, sprintId } = req.params;
    const result = await SprintPredictor.predict(projectId, sprintId);
    return ApiResponse.success(res, result);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};