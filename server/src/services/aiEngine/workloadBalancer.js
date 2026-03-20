const Task = require('../../models/Task');
const MoodCheckIn = require('../../models/MoodCheckIn');
const SkillMatcher = require('./skillMatcher');
const dayjs = require('dayjs');

class WorkloadBalancer {
  /**
   * Calculate workload score for a developer (higher = better to assign)
   */
  static async calculateWorkloadScore(developer, task, projectId) {
    const thirtyDaysAgo = dayjs().subtract(30, 'day').toDate();

    // 1. Current task load
    const currentTasks = await Task.countDocuments({
      assignee: developer._id,
      project: projectId,
      status: { $in: ['todo', 'in-progress', 'in-review', 'testing'] }
    });

    const MAX_TASKS = 10;
    const taskLoadScore = Math.max(0, 1 - currentTasks / MAX_TASKS);

    // 2. Skill match
    const skillMatchScore = task.requiredSkills
      ? SkillMatcher.calculate(developer.skills, task.requiredSkills)
      : 0.5;

    // 3. Complexity capacity
    const completedTasks = await Task.find({
      assignee: developer._id,
      status: 'done',
      completedAt: { $gte: thirtyDaysAgo }
    });

    const avgComplexity =
      completedTasks.length > 0
        ? completedTasks.reduce((sum, t) => sum + t.complexity, 0) /
          completedTasks.length
        : 5;
    const complexityScore = Math.min(1, avgComplexity / 10);

    // 4. Burnout risk
    const burnoutRisk = developer.burnoutProfile?.currentRiskScore || 0;
    const burnoutFactor = Math.max(0, 1 - burnoutRisk / 100);

    // 5. Completion speed
    const avgCompletionTime =
      completedTasks.length > 0
        ? completedTasks.reduce((sum, t) => {
            if (t.startedAt && t.completedAt) {
              return sum + (t.completedAt - t.startedAt) / (1000 * 60 * 60);
            }
            return sum;
          }, 0) / completedTasks.length
        : 24;

    const BENCHMARK = 16;
    const speedScore = Math.min(1, BENCHMARK / Math.max(avgCompletionTime, 1));

    // Weighted final score
    const weights = {
      taskLoad: 0.30,
      skillMatch: 0.25,
      complexity: 0.15,
      burnout: 0.20,
      speed: 0.10
    };

    const totalScore =
      taskLoadScore * weights.taskLoad +
      skillMatchScore * weights.skillMatch +
      complexityScore * weights.complexity +
      burnoutFactor * weights.burnout +
      speedScore * weights.speed;

    return {
      developer: {
        _id: developer._id,
        name: `${developer.firstName} ${developer.lastName}`,
        avatar: developer.avatar,
        role: developer.role
      },
      totalScore: Math.round(totalScore * 100) / 100,
      breakdown: {
        taskLoad: {
          score: Math.round(taskLoadScore * 100),
          currentTasks,
          maxTasks: MAX_TASKS
        },
        skillMatch: {
          score: Math.round(skillMatchScore * 100)
        },
        complexity: {
          score: Math.round(complexityScore * 100),
          avgComplexity: Math.round(avgComplexity * 10) / 10
        },
        burnout: {
          score: Math.round(burnoutFactor * 100),
          riskLevel: developer.burnoutProfile?.riskLevel || 'LOW'
        },
        speed: {
          score: Math.round(speedScore * 100),
          avgHours: Math.round(avgCompletionTime * 10) / 10
        }
      }
    };
  }

  /**
   * Auto-assign task to best developer
   */
  static async autoAssignTask(taskId, projectId) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    const Project = require('../../models/Project');
    const project = await Project.findById(projectId).populate('members.user');

    if (!project) throw new Error('Project not found');

    const developers = project.members
      .filter((m) => m.role !== 'viewer')
      .map((m) => m.user)
      .filter((u) => u && u.isActive);

    if (developers.length === 0) {
      throw new Error('No available developers');
    }

    const scores = await Promise.all(
      developers.map((dev) => this.calculateWorkloadScore(dev, task, projectId))
    );

    scores.sort((a, b) => b.totalScore - a.totalScore);

    const bestMatch = scores[0];

    // Update task
    task.assignee = bestMatch.developer._id;
    task.assignmentMethod = 'ai-auto';
    task.aiAssignmentSuggestion = {
      suggestedAssignee: bestMatch.developer._id,
      matchScore: bestMatch.totalScore,
      reasoning: this.generateReasoning(bestMatch)
    };

    await task.save();
    await task.populate('assignee', 'firstName lastName avatar');

    return {
      assignedTo: bestMatch.developer,
      matchScore: bestMatch.totalScore,
      reasoning: this.generateReasoning(bestMatch),
      allScores: scores.slice(0, 5),
      task
    };
  }

  /**
   * Get team workload analysis
   */
  static async getTeamWorkload(projectId) {
    const Project = require('../../models/Project');
    const project = await Project.findById(projectId).populate(
      'members.user',
      'firstName lastName avatar role skills burnoutProfile'
    );

    if (!project) throw new Error('Project not found');

    const teamAnalysis = await Promise.all(
      project.members.map(async (member) => {
        const user = member.user;
        if (!user) return null;

        const tasks = await Task.find({
          assignee: user._id,
          project: projectId,
          status: { $ne: 'done' }
        });

        const completedTasks = await Task.countDocuments({
          assignee: user._id,
          project: projectId,
          status: 'done'
        });

        const totalComplexity = tasks.reduce((sum, t) => sum + (t.complexity || 3), 0);
        const criticalTasks = tasks.filter((t) => t.priority === 'critical').length;
        const highTasks = tasks.filter((t) => t.priority === 'high').length;
        const overdueTasks = tasks.filter(
          (t) => t.dueDate && new Date(t.dueDate) < new Date()
        ).length;

        const workloadLevel = this.getWorkloadLevel(tasks.length, totalComplexity);

        return {
          user: {
            _id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar,
            role: member.role
          },
          metrics: {
            activeTasks: tasks.length,
            completedTasks,
            totalComplexity,
            criticalTasks,
            highTasks,
            overdueTasks,
            burnoutRisk: user.burnoutProfile?.currentRiskScore || 0,
            burnoutLevel: user.burnoutProfile?.riskLevel || 'LOW'
          },
          workloadLevel,
          tasks: tasks.slice(0, 5).map((t) => ({
            _id: t._id,
            taskId: t.taskId,
            title: t.title,
            status: t.status,
            priority: t.priority,
            complexity: t.complexity,
            dueDate: t.dueDate
          }))
        };
      })
    );

    const validAnalysis = teamAnalysis.filter(Boolean);
    const totalActiveTasks = validAnalysis.reduce(
      (sum, m) => sum + m.metrics.activeTasks, 0
    );
    const avgTasks = validAnalysis.length > 0
      ? totalActiveTasks / validAnalysis.length
      : 0;

    const overloaded = validAnalysis.filter(
      (m) => m.metrics.activeTasks > avgTasks * 1.5
    );
    const underloaded = validAnalysis.filter(
      (m) => m.metrics.activeTasks < avgTasks * 0.5 && avgTasks > 0
    );
    const burnoutRisk = validAnalysis.filter(
      (m) => m.metrics.burnoutRisk > 60
    );

    return {
      team: validAnalysis,
      insights: {
        totalActiveTasks,
        avgTasksPerMember: Math.round(avgTasks * 10) / 10,
        totalMembers: validAnalysis.length,
        overloadedMembers: overloaded.map((m) => m.user.name),
        underloadedMembers: underloaded.map((m) => m.user.name),
        burnoutRiskMembers: burnoutRisk.map((m) => ({
          name: m.user.name,
          risk: m.metrics.burnoutRisk
        })),
        redistributionNeeded: overloaded.length > 0,
        recommendations: this.generateTeamRecommendations(validAnalysis, avgTasks)
      }
    };
  }

  static getWorkloadLevel(taskCount, totalComplexity) {
    const score = taskCount * 0.6 + totalComplexity * 0.04;
    if (score > 8) return { level: 'OVERLOADED', color: '#ef4444', emoji: '🔴', percent: 100 };
    if (score > 5) return { level: 'HIGH', color: '#f97316', emoji: '🟠', percent: 75 };
    if (score > 3) return { level: 'MODERATE', color: '#eab308', emoji: '🟡', percent: 50 };
    return { level: 'LOW', color: '#22c55e', emoji: '🟢', percent: 25 };
  }

  static generateReasoning(scoreResult) {
    const { breakdown } = scoreResult;
    const reasons = [];
    if (breakdown.taskLoad.score > 70) reasons.push(`Low workload (${breakdown.taskLoad.currentTasks} active tasks)`);
    if (breakdown.skillMatch.score > 70) reasons.push('Strong skill match');
    if (breakdown.burnout.score > 80) reasons.push('Low burnout risk');
    if (breakdown.speed.score > 70) reasons.push('Fast completion rate');
    return reasons.join('. ') || 'Best available match based on overall scoring.';
  }

  static generateTeamRecommendations(teamAnalysis, avgTasks) {
    const recommendations = [];
    const overloaded = teamAnalysis.filter((m) => m.metrics.activeTasks > avgTasks * 1.5);
    const underloaded = teamAnalysis.filter((m) => m.metrics.activeTasks < avgTasks * 0.5 && avgTasks > 0);

    if (overloaded.length > 0 && underloaded.length > 0) {
      recommendations.push({
        type: 'redistribute',
        priority: 'HIGH',
        message: `Redistribute tasks from ${overloaded.map((m) => m.user.name).join(', ')} to ${underloaded.map((m) => m.user.name).join(', ')}`,
        icon: '📋'
      });
    }

    const highBurnout = teamAnalysis.filter((m) => m.metrics.burnoutRisk > 70);
    if (highBurnout.length > 0) {
      recommendations.push({
        type: 'burnout',
        priority: 'CRITICAL',
        message: `High burnout risk: ${highBurnout.map((m) => m.user.name).join(', ')}. Schedule 1-on-1 check-ins.`,
        icon: '🔥'
      });
    }

    const overdueMembers = teamAnalysis.filter((m) => m.metrics.overdueTasks > 0);
    if (overdueMembers.length > 0) {
      recommendations.push({
        type: 'overdue',
        priority: 'HIGH',
        message: `Overdue tasks: ${overdueMembers.map((m) => `${m.user.name} (${m.metrics.overdueTasks})`).join(', ')}`,
        icon: '⏰'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'healthy',
        priority: 'LOW',
        message: 'Team workload looks balanced! Keep up the good work.',
        icon: '✅'
      });
    }

    return recommendations;
  }
}

module.exports = WorkloadBalancer;