const Task = require('../../models/Task');
const ActivityLog = require('../../models/ActivityLog');
const User = require('../../models/User');
const dayjs = require('dayjs');

class BurnoutDetector {
  /**
   * Calculate burnout risk for a user
   */
  static async calculateBurnoutRisk(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const thirtyDaysAgo = dayjs().subtract(30, 'day').toDate();

    // Factor 1: Task overload
    const activeTasks = await Task.countDocuments({
      assignee: userId,
      status: { $in: ['todo', 'in-progress', 'in-review', 'testing'] }
    });
    const TEAM_AVG = 6;
    const taskOverloadRatio = activeTasks / TEAM_AVG;
    const taskScore = taskOverloadRatio > 2 ? 20 : taskOverloadRatio > 1.5 ? 15 : taskOverloadRatio > 1 ? 8 : 0;

    // Factor 2: Overdue tasks
    const overdueTasks = await Task.countDocuments({
      assignee: userId,
      status: { $ne: 'done' },
      dueDate: { $lt: new Date() }
    });
    const overdueScore = overdueTasks > 5 ? 20 : overdueTasks > 3 ? 15 : overdueTasks > 1 ? 8 : 0;

    // Factor 3: Task complexity
    const tasks = await Task.find({
      assignee: userId,
      status: { $in: ['todo', 'in-progress', 'in-review'] }
    });
    const avgComplexity = tasks.length > 0
      ? tasks.reduce((sum, t) => sum + (t.complexity || 3), 0) / tasks.length
      : 3;
    const complexityScore = avgComplexity > 8 ? 15 : avgComplexity > 6 ? 10 : avgComplexity > 4 ? 5 : 0;

    // Factor 4: Days since PTO
    const daysSincePTO = user.burnoutProfile?.lastPTODate
      ? dayjs().diff(dayjs(user.burnoutProfile.lastPTODate), 'day')
      : 90;
    const ptoScore = daysSincePTO > 90 ? 15 : daysSincePTO > 60 ? 10 : daysSincePTO > 30 ? 5 : 0;

    // Factor 5: Critical/High priority tasks
    const criticalTasks = tasks.filter((t) => t.priority === 'critical' || t.priority === 'high').length;
    const priorityScore = criticalTasks > 5 ? 15 : criticalTasks > 3 ? 10 : criticalTasks > 1 ? 5 : 0;

    // Factor 6: Recent activity volume
    const recentActivities = await ActivityLog.countDocuments({
      user: userId,
      timestamp: { $gte: thirtyDaysAgo }
    });
    const avgDailyActivity = recentActivities / 30;
    const activityScore = avgDailyActivity > 20 ? 10 : avgDailyActivity > 15 ? 7 : 0;

    // Factor 7: Comment sentiment
    const recentTasks = await Task.find({
      assignee: userId,
      updatedAt: { $gte: dayjs().subtract(7, 'day').toDate() }
    });
    const negativeComments = recentTasks.reduce((count, t) => {
      return count + (t.comments || []).filter(
        (c) => c.user?.toString() === userId.toString() && c.sentiment === 'negative'
      ).length;
    }, 0);
    const sentimentScore = negativeComments > 5 ? 5 : negativeComments > 2 ? 3 : 0;

    // Total
    const totalRisk = Math.min(100,
      taskScore + overdueScore + complexityScore +
      ptoScore + priorityScore + activityScore + sentimentScore
    );

    const riskLevel = totalRisk > 70 ? 'CRITICAL'
      : totalRisk > 50 ? 'HIGH'
      : totalRisk > 30 ? 'MEDIUM'
      : 'LOW';

    // Update user profile
    await User.findByIdAndUpdate(userId, {
      'burnoutProfile.currentRiskScore': totalRisk,
      'burnoutProfile.riskLevel': riskLevel,
      'burnoutProfile.lastBurnoutCheck': new Date()
    });

    return {
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      riskScore: totalRisk,
      riskLevel,
      factors: [
        {
          name: 'Task Overload',
          score: taskScore,
          maxScore: 20,
          value: `${activeTasks} active tasks (avg: ${TEAM_AVG})`,
          status: taskScore > 10 ? 'danger' : taskScore > 5 ? 'warning' : 'good',
          icon: '📋'
        },
        {
          name: 'Overdue Tasks',
          score: overdueScore,
          maxScore: 20,
          value: `${overdueTasks} overdue tasks`,
          status: overdueScore > 10 ? 'danger' : overdueScore > 5 ? 'warning' : 'good',
          icon: '⏰'
        },
        {
          name: 'Task Complexity',
          score: complexityScore,
          maxScore: 15,
          value: `Avg complexity: ${Math.round(avgComplexity * 10) / 10}/10`,
          status: complexityScore > 10 ? 'danger' : complexityScore > 5 ? 'warning' : 'good',
          icon: '🧩'
        },
        {
          name: 'Time Off Gap',
          score: ptoScore,
          maxScore: 15,
          value: `${daysSincePTO} days since last PTO`,
          status: ptoScore > 10 ? 'danger' : ptoScore > 5 ? 'warning' : 'good',
          icon: '🏖️'
        },
        {
          name: 'High Priority Load',
          score: priorityScore,
          maxScore: 15,
          value: `${criticalTasks} critical/high tasks`,
          status: priorityScore > 10 ? 'danger' : priorityScore > 5 ? 'warning' : 'good',
          icon: '🚨'
        },
        {
          name: 'Activity Volume',
          score: activityScore,
          maxScore: 10,
          value: `${Math.round(avgDailyActivity)} actions/day`,
          status: activityScore > 5 ? 'warning' : 'good',
          icon: '📊'
        },
        {
          name: 'Comment Sentiment',
          score: sentimentScore,
          maxScore: 5,
          value: `${negativeComments} negative comments this week`,
          status: sentimentScore > 3 ? 'warning' : 'good',
          icon: '💬'
        }
      ],
      recommendations: this.generateRecommendations(totalRisk, {
        activeTasks, overdueTasks, daysSincePTO, criticalTasks, avgComplexity
      })
    };
  }

  static generateRecommendations(riskScore, factors) {
    const recs = [];

    if (factors.activeTasks > 8) {
      recs.push({ priority: 'HIGH', action: `Redistribute ${factors.activeTasks - 6} tasks to other members`, icon: '📋' });
    }
    if (factors.overdueTasks > 2) {
      recs.push({ priority: 'HIGH', action: `Address ${factors.overdueTasks} overdue tasks — extend deadlines or get help`, icon: '⏰' });
    }
    if (factors.daysSincePTO > 60) {
      recs.push({ priority: 'MEDIUM', action: `${factors.daysSincePTO} days without PTO. Suggest a break.`, icon: '🏖️' });
    }
    if (factors.criticalTasks > 3) {
      recs.push({ priority: 'HIGH', action: 'Too many high-priority tasks. Re-prioritize with manager.', icon: '🚨' });
    }
    if (riskScore > 70) {
      recs.push({ priority: 'CRITICAL', action: 'URGENT: Schedule a 1-on-1 wellness check with this team member.', icon: '🔥' });
    }
    if (recs.length === 0) {
      recs.push({ priority: 'LOW', action: 'Looking good! Burnout risk is low.', icon: '✅' });
    }

    return recs;
  }
}

module.exports = BurnoutDetector;