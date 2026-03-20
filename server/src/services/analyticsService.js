const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const MoodCheckIn = require('../models/MoodCheckIn');
const ActivityLog = require('../models/ActivityLog');
const dayjs = require('dayjs');

class AnalyticsService {
  /**
   * Project-level analytics
   */
  static async getProjectAnalytics(projectId) {
    const project = await Project.findById(projectId)
      .populate('members.user', 'firstName lastName avatar');

    if (!project) throw new Error('Project not found');

    const allTasks = await Task.find({ project: projectId });

    // Status breakdown
    const statusBreakdown = {};
    const statuses = ['backlog', 'todo', 'in-progress', 'in-review', 'testing', 'done'];
    statuses.forEach((s) => { statusBreakdown[s] = 0; });
    allTasks.forEach((t) => {
      statusBreakdown[t.status] = (statusBreakdown[t.status] || 0) + 1;
    });

    // Priority breakdown
    const priorityBreakdown = {};
    const priorities = ['critical', 'high', 'medium', 'low'];
    priorities.forEach((p) => { priorityBreakdown[p] = 0; });
    allTasks.forEach((t) => {
      priorityBreakdown[t.priority] = (priorityBreakdown[t.priority] || 0) + 1;
    });

    // Type breakdown
    const typeBreakdown = {};
    allTasks.forEach((t) => {
      typeBreakdown[t.type] = (typeBreakdown[t.type] || 0) + 1;
    });

    // Member workload
    const memberWorkload = await Promise.all(
      project.members.map(async (m) => {
        if (!m.user) return null;
        const memberTasks = allTasks.filter(
          (t) => t.assignee?.toString() === m.user._id.toString()
        );
        return {
          user: {
            _id: m.user._id,
            name: `${m.user.firstName} ${m.user.lastName}`,
            avatar: m.user.avatar
          },
          total: memberTasks.length,
          completed: memberTasks.filter((t) => t.status === 'done').length,
          inProgress: memberTasks.filter((t) => t.status === 'in-progress').length,
          overdue: memberTasks.filter(
            (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
          ).length
        };
      })
    );

    // Completion over time (last 30 days)
    const completionOverTime = [];
    for (let i = 29; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').startOf('day');
      const dateEnd = date.endOf('day');
      const completed = allTasks.filter(
        (t) => t.completedAt &&
          dayjs(t.completedAt).isAfter(date) &&
          dayjs(t.completedAt).isBefore(dateEnd)
      ).length;
      completionOverTime.push({
        date: date.format('MMM D'),
        fullDate: date.format('YYYY-MM-DD'),
        completed
      });
    }

    // Overdue tasks
    const overdueTasks = allTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    );

    // Average completion time
    const completedTasks = allTasks.filter((t) => t.startedAt && t.completedAt);
    const avgCompletionHours = completedTasks.length > 0
      ? Math.round(
          completedTasks.reduce((sum, t) => {
            return sum + (t.completedAt - t.startedAt) / (1000 * 60 * 60);
          }, 0) / completedTasks.length
        )
      : 0;

    return {
      overview: {
        totalTasks: allTasks.length,
        completedTasks: statusBreakdown.done || 0,
        inProgressTasks: statusBreakdown['in-progress'] || 0,
        overdueTasks: overdueTasks.length,
        completionRate: allTasks.length > 0
          ? Math.round(((statusBreakdown.done || 0) / allTasks.length) * 100)
          : 0,
        avgCompletionHours,
        totalMembers: project.members.length
      },
      statusBreakdown: statuses.map((s) => ({
        status: s,
        count: statusBreakdown[s] || 0
      })),
      priorityBreakdown: priorities.map((p) => ({
        priority: p,
        count: priorityBreakdown[p] || 0
      })),
      typeBreakdown: Object.entries(typeBreakdown).map(([type, count]) => ({
        type,
        count
      })),
      memberWorkload: memberWorkload.filter(Boolean),
      completionOverTime
    };
  }

  /**
   * Dashboard summary for current user
   */
  static async getDashboardSummary(userId) {
    // My tasks
    const myTotalTasks = await Task.countDocuments({ assignee: userId });
    const myCompletedTasks = await Task.countDocuments({ assignee: userId, status: 'done' });
    const myActiveTasks = await Task.countDocuments({
      assignee: userId,
      status: { $in: ['todo', 'in-progress', 'in-review', 'testing'] }
    });
    const myOverdueTasks = await Task.countDocuments({
      assignee: userId,
      status: { $ne: 'done' },
      dueDate: { $lt: new Date() }
    });

    // My projects
    const myProjects = await Project.countDocuments({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    });

    // Recent activity
    const recentActivity = await ActivityLog.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('project', 'name icon')
      .populate('task', 'title taskId');

    // Today's mood
    const today = dayjs().startOf('day').toDate();
    const todayMood = await MoodCheckIn.findOne({
      user: userId,
      date: { $gte: today }
    });

    // Tasks completed this week
    const weekStart = dayjs().startOf('week').toDate();
    const completedThisWeek = await Task.countDocuments({
      assignee: userId,
      status: 'done',
      completedAt: { $gte: weekStart }
    });

    // Upcoming deadlines (next 7 days)
    const nextWeek = dayjs().add(7, 'day').toDate();
    const upcomingDeadlines = await Task.find({
      assignee: userId,
      status: { $ne: 'done' },
      dueDate: { $gte: new Date(), $lte: nextWeek }
    })
      .populate('project', 'name icon key')
      .sort({ dueDate: 1 })
      .limit(5);

    // User burnout
    const user = await User.findById(userId).select('burnoutProfile');

    return {
      tasks: {
        total: myTotalTasks,
        completed: myCompletedTasks,
        active: myActiveTasks,
        overdue: myOverdueTasks,
        completedThisWeek
      },
      projects: myProjects,
      todayMood: todayMood?.mood || null,
      burnoutRisk: user?.burnoutProfile?.currentRiskScore || 0,
      burnoutLevel: user?.burnoutProfile?.riskLevel || 'LOW',
      upcomingDeadlines,
      recentActivity: recentActivity.map((a) => ({
        _id: a._id,
        action: a.action,
        details: a.details,
        project: a.project,
        task: a.task,
        timestamp: a.timestamp
      }))
    };
  }

  /**
   * Activity heatmap data (GitHub-style)
   */
  static async getActivityHeatmap(userId) {
    const sixMonthsAgo = dayjs().subtract(6, 'month').startOf('day').toDate();

    const activities = await ActivityLog.aggregate([
      {
        $match: {
          user: require('mongoose').Types.ObjectId.createFromHexString(userId),
          timestamp: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing days with 0
    const heatmapData = [];
    const totalDays = dayjs().diff(dayjs(sixMonthsAgo), 'day');

    for (let i = 0; i <= totalDays; i++) {
      const date = dayjs(sixMonthsAgo).add(i, 'day').format('YYYY-MM-DD');
      const activity = activities.find((a) => a._id === date);
      heatmapData.push({
        date,
        count: activity?.count || 0
      });
    }

    return heatmapData;
  }

  /**
   * Mood analytics for a project
   */
  static async getMoodAnalytics(projectId) {
    const thirtyDaysAgo = dayjs().subtract(30, 'day').toDate();

    const project = await Project.findById(projectId)
      .populate('members.user', 'firstName lastName');

    if (!project) throw new Error('Project not found');

    const memberIds = project.members.map((m) => m.user?._id).filter(Boolean);

    const moods = await MoodCheckIn.find({
      user: { $in: memberIds },
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    // Daily average mood
    const dailyMood = [];
    for (let i = 29; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const dayMoods = moods.filter((m) =>
        dayjs(m.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
      );
      const avg = dayMoods.length > 0
        ? Math.round((dayMoods.reduce((s, m) => s + m.mood, 0) / dayMoods.length) * 10) / 10
        : null;

      dailyMood.push({
        date: date.format('MMM D'),
        fullDate: date.format('YYYY-MM-DD'),
        avgMood: avg,
        count: dayMoods.length
      });
    }

    return { dailyMood };
  }
}

module.exports = AnalyticsService;