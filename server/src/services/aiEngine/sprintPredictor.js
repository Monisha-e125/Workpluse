const Task = require('../../models/Task');

class SprintPredictor {
  static async predict(projectId, sprintId) {
    const tasks = await Task.find({ project: projectId, sprint: sprintId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
    const totalPoints = tasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
    const completedPoints = tasks.filter((t) => t.status === 'done').reduce((s, t) => s + (t.storyPoints || 0), 0);

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    let prediction = 'on-track';
    let confidence = 70;
    let message = '';

    if (completionRate > 80) {
      prediction = 'ahead';
      confidence = 90;
      message = 'Sprint is ahead of schedule! Great work.';
    } else if (completionRate > 50) {
      prediction = 'on-track';
      confidence = 75;
      message = 'Sprint is progressing well.';
    } else if (completionRate > 25) {
      prediction = 'at-risk';
      confidence = 60;
      message = 'Sprint may not be completed on time. Consider descoping.';
    } else {
      prediction = 'behind';
      confidence = 80;
      message = 'Sprint is significantly behind. Immediate action needed.';
    }

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      remainingTasks: totalTasks - completedTasks,
      totalPoints,
      completedPoints,
      completionRate: Math.round(completionRate),
      prediction,
      confidence,
      message
    };
  }
}

module.exports = SprintPredictor;