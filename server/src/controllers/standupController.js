const Standup = require('../models/Standup');
const Task = require('../models/Task');
const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const dayjs = require('dayjs');
const logger = require('../utils/logger');

// ═══ GENERATE AUTO STANDUP ═══
exports.generateStandup = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('members.user', 'firstName lastName avatar');

    if (!project) return ApiResponse.notFound(res, 'Project not found');

    const yesterday = dayjs().subtract(1, 'day').startOf('day').toDate();
    const today = dayjs().startOf('day').toDate();

    // Generate entries for each member
    const entries = await Promise.all(
      project.members.map(async (member) => {
        if (!member.user) return null;

        // Tasks completed/updated yesterday
        const yesterdayTasks = await Task.find({
          project: projectId,
          assignee: member.user._id,
          updatedAt: { $gte: yesterday, $lt: today }
        }).select('title taskId status');

        // Tasks currently in progress
        const todayTasks = await Task.find({
          project: projectId,
          assignee: member.user._id,
          status: { $in: ['in-progress', 'in-review', 'testing'] }
        }).select('title taskId status');

        // Blocked tasks
        const blockedTasks = await Task.find({
          project: projectId,
          assignee: member.user._id,
          isBlocked: true
        }).select('title taskId blockedReason');

        // Overdue tasks as blockers
        const overdueTasks = await Task.find({
          project: projectId,
          assignee: member.user._id,
          status: { $ne: 'done' },
          dueDate: { $lt: new Date() }
        }).select('title taskId');

        return {
          user: member.user._id,
          yesterday: yesterdayTasks.map((t) => ({
            task: t._id,
            description: `${t.status === 'done' ? 'Completed' : 'Worked on'}: ${t.title} (${t.taskId})`,
            autoDetected: true
          })),
          today: todayTasks.map((t) => ({
            task: t._id,
            description: `Working on: ${t.title} (${t.taskId})`
          })),
          blockers: [
            ...blockedTasks.map((t) => ({
              description: `Blocked: ${t.title} — ${t.blockedReason || 'No reason specified'}`,
              severity: 'high'
            })),
            ...overdueTasks.map((t) => ({
              description: `Overdue: ${t.title} (${t.taskId})`,
              severity: 'medium'
            }))
          ]
        };
      })
    );

    // Sprint health
    const allTasks = await Task.find({ project: projectId, status: { $ne: 'done' } });
    const doneTasks = await Task.countDocuments({ project: projectId, status: 'done' });
    const totalTasks = allTasks.length + doneTasks;
    const sprintHealth = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const overdue = allTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date());
    const critical = allTasks.filter((t) => t.priority === 'critical');

    // AI Insights
    const recommendations = [];
    if (overdue.length > 0) {
      recommendations.push(`${overdue.length} task(s) are overdue. Consider extending deadlines or redistributing.`);
    }
    if (critical.length > 3) {
      recommendations.push(`${critical.length} critical tasks remaining. Focus on these first.`);
    }
    if (sprintHealth < 30) {
      recommendations.push('Sprint progress is below 30%. Consider descoping to meet deadline.');
    }
    if (sprintHealth > 80) {
      recommendations.push('Great progress! Sprint is on track for completion.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Team is progressing well. Keep up the good work!');
    }

    // Save standup
    const standup = await Standup.create({
      project: projectId,
      date: today,
      generationType: 'auto-generated',
      entries: entries.filter(Boolean),
      aiInsights: {
        sprintHealth,
        atRiskItems: overdue.map((t) => `${t.taskId}: ${t.title}`).slice(0, 5),
        velocityComparison: sprintHealth > 50 ? 'Above average' : 'Below average',
        recommendations
      }
    });

    await standup.populate('entries.user', 'firstName lastName avatar');

    logger.info(`🤖 Auto standup generated for project ${projectId}`);
    return ApiResponse.success(res, standup, 'Standup generated');
  } catch (error) {
    logger.error(`Generate standup error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET STANDUPS ═══
exports.getStandups = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 10 } = req.query;

    const standups = await Standup.find({ project: projectId })
      .populate('entries.user', 'firstName lastName avatar')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    return ApiResponse.success(res, standups);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET LATEST STANDUP ═══
exports.getLatestStandup = async (req, res) => {
  try {
    const { projectId } = req.params;

    const standup = await Standup.findOne({ project: projectId })
      .populate('entries.user', 'firstName lastName avatar')
      .sort({ date: -1 });

    if (!standup) {
      return ApiResponse.success(res, null, 'No standups yet');
    }

    return ApiResponse.success(res, standup);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};