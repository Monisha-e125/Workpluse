const Task = require('../models/Task');
const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination } = require('../utils/pagination');
const { logActivity } = require('../middleware/activityLogger');
const { emitToProject, emitToUser } = require('../config/socket');
const NotificationService = require('../services/notificationService');
const logger = require('../utils/logger');

// Simple sentiment analysis
function analyzeSentiment(text) {
  const positive = ['great', 'good', 'excellent', 'awesome', 'done', 'fixed', 'resolved', 'working', 'perfect', 'nice', 'love', 'thanks'];
  const negative = ['bug', 'issue', 'problem', 'broken', 'fail', 'error', 'stuck', 'blocked', 'confused', 'wrong', 'bad', 'hate'];
  const lower = text.toLowerCase();
  const pos = positive.filter((w) => lower.includes(w)).length;
  const neg = negative.filter((w) => lower.includes(w)).length;
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

// ═══ CREATE TASK ═══
exports.createTask = async (req, res) => {
  try {
    const {
      title, description, project, sprint, assignee,
      priority, type, complexity, storyPoints,
      requiredSkills, estimatedHours, dueDate, labels, status
    } = req.body;

    const projectDoc = await Project.findById(project);
    if (!projectDoc) return ApiResponse.notFound(res, 'Project not found');

    const task = await Task.create({
      title, description, project, sprint, assignee,
      reporter: req.user._id,
      priority: priority || 'medium',
      type: type || 'task',
      complexity, storyPoints, requiredSkills,
      estimatedHours, dueDate, labels,
      status: status || 'backlog'
    });

    projectDoc.taskCount += 1;
    await projectDoc.save();

    await task.populate([
      { path: 'assignee', select: 'firstName lastName avatar' },
      { path: 'reporter', select: 'firstName lastName avatar' }
    ]);

    // Real-time notify
    emitToProject(project, 'task-created', task);

    // ✅ NOTIFICATION: Task assigned
    if (assignee && assignee.toString() !== req.user._id.toString()) {
      await NotificationService.taskAssigned({
        task,
        assigneeId: assignee,
        assignedBy: req.user
      });
    }

    logActivity({
      userId: req.user._id,
      projectId: project,
      taskId: task._id,
      action: 'task-created',
      details: { title, taskId: task.taskId }
    });

    return ApiResponse.created(res, task, 'Task created');
  } catch (error) {
    logger.error(`Create task error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET TASKS ═══
exports.getTasks = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.project) filter.project = req.query.project;
    if (req.query.sprint) filter.sprint = req.query.sprint;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignee) filter.assignee = req.query.assignee;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { taskId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('assignee', 'firstName lastName avatar')
      .populate('reporter', 'firstName lastName avatar')
      .sort(req.query.sort || { order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return ApiResponse.paginated(res, tasks, page, limit, total);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET KANBAN TASKS ═══
exports.getKanbanTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const filter = { project: projectId };
    if (req.query.sprint) filter.sprint = req.query.sprint;
    if (req.query.assignee) filter.assignee = req.query.assignee;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter)
      .populate('assignee', 'firstName lastName avatar')
      .populate('reporter', 'firstName lastName avatar')
      .sort({ order: 1, createdAt: -1 });

    const columns = {
      backlog: { id: 'backlog', title: '📋 Backlog', tasks: [] },
      todo: { id: 'todo', title: '📝 To Do', tasks: [] },
      'in-progress': { id: 'in-progress', title: '🔄 In Progress', tasks: [] },
      'in-review': { id: 'in-review', title: '👀 In Review', tasks: [] },
      testing: { id: 'testing', title: '🧪 Testing', tasks: [] },
      done: { id: 'done', title: '✅ Done', tasks: [] }
    };

    tasks.forEach((task) => {
      if (columns[task.status]) columns[task.status].tasks.push(task);
    });

    return ApiResponse.success(res, {
      columns,
      columnOrder: ['backlog', 'todo', 'in-progress', 'in-review', 'testing', 'done'],
      totalTasks: tasks.length
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET TASK BY ID ═══
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'firstName lastName avatar email')
      .populate('reporter', 'firstName lastName avatar email')
      .populate('comments.user', 'firstName lastName avatar');

    if (!task) return ApiResponse.notFound(res, 'Task not found');
    return ApiResponse.success(res, task);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ UPDATE TASK ═══
exports.updateTask = async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);
    if (!oldTask) return ApiResponse.notFound(res, 'Task not found');

    const oldAssignee = oldTask.assignee?.toString();

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignee', 'firstName lastName avatar')
      .populate('reporter', 'firstName lastName avatar');

    emitToProject(task.project.toString(), 'task-updated', task);

    // ✅ NOTIFICATION: Assignee changed
    if (req.body.assignee && req.body.assignee !== oldAssignee) {
      await NotificationService.taskAssigned({
        task,
        assigneeId: req.body.assignee,
        assignedBy: req.user
      });
    }

    return ApiResponse.success(res, task, 'Task updated');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ UPDATE TASK STATUS (Kanban drag & drop) ═══
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, order } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return ApiResponse.notFound(res, 'Task not found');

    const previousStatus = task.status;

    task.statusHistory.push({
      from: previousStatus,
      to: status,
      changedBy: req.user._id,
      changedAt: new Date(),
      timeInStatus: task.updatedAt
        ? Math.round((Date.now() - task.updatedAt.getTime()) / 60000)
        : 0
    });

    task.status = status;
    if (order !== undefined) task.order = order;

    if (status === 'done' && previousStatus !== 'done') {
      task.completedAt = new Date();
      await Project.findByIdAndUpdate(task.project, { $inc: { completedTaskCount: 1 } });
    }
    if (previousStatus === 'done' && status !== 'done') {
      task.completedAt = null;
      await Project.findByIdAndUpdate(task.project, { $inc: { completedTaskCount: -1 } });
    }
    if (status === 'in-progress' && !task.startedAt) {
      task.startedAt = new Date();
    }

    await task.save();
    await task.populate('assignee', 'firstName lastName avatar');

    const changedByName = req.user.fullName || `${req.user.firstName} ${req.user.lastName}`;

    emitToProject(task.project.toString(), 'task-status-changed', {
      taskId: task._id,
      previousStatus,
      newStatus: status,
      task,
      changedBy: changedByName
    });

    // ✅ NOTIFICATION: Status changed — notify assignee
    if (task.assignee && task.assignee._id.toString() !== req.user._id.toString()) {
      if (status === 'done') {
        await NotificationService.taskCompleted({
          task,
          completedBy: req.user,
          notifyUserId: task.assignee._id
        });
      } else {
        await NotificationService.taskStatusChanged({
          task,
          changedBy: req.user,
          previousStatus,
          newStatus: status,
          notifyUserId: task.assignee._id
        });
      }
    }

    // ✅ NOTIFICATION: Status changed — notify reporter
    if (task.reporter && task.reporter.toString() !== req.user._id.toString() &&
        task.reporter.toString() !== task.assignee?._id?.toString()) {
      await NotificationService.taskStatusChanged({
        task,
        changedBy: req.user,
        previousStatus,
        newStatus: status,
        notifyUserId: task.reporter
      });
    }

    logActivity({
      userId: req.user._id,
      projectId: task.project,
      taskId: task._id,
      action: 'task-status-changed',
      details: { from: previousStatus, to: status }
    });

    return ApiResponse.success(res, task, 'Task status updated');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ DELETE TASK ═══
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return ApiResponse.notFound(res, 'Task not found');

    await Project.findByIdAndUpdate(task.project, {
      $inc: {
        taskCount: -1,
        ...(task.status === 'done' ? { completedTaskCount: -1 } : {})
      }
    });

    await Task.findByIdAndDelete(req.params.id);
    emitToProject(task.project.toString(), 'task-deleted', { taskId: task._id });

    return ApiResponse.success(res, null, 'Task deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ ADD COMMENT ═══
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return ApiResponse.badRequest(res, 'Comment text required');

    const task = await Task.findById(req.params.id);
    if (!task) return ApiResponse.notFound(res, 'Task not found');

    task.comments.push({
      user: req.user._id,
      text: text.trim(),
      sentiment: analyzeSentiment(text),
      createdAt: new Date()
    });

    await task.save();
    await task.populate('comments.user', 'firstName lastName avatar');

    const newComment = task.comments[task.comments.length - 1];

    emitToProject(task.project.toString(), 'comment-added', {
      taskId: task._id,
      comment: newComment
    });

    // ✅ NOTIFICATION: Comment — notify assignee
    if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
      await NotificationService.commentAdded({
        task,
        commentBy: req.user,
        commentText: text.trim(),
        notifyUserId: task.assignee
      });
    }

    // ✅ NOTIFICATION: Comment — notify reporter (if different from assignee)
    if (task.reporter && task.reporter.toString() !== req.user._id.toString() &&
        task.reporter.toString() !== task.assignee?.toString()) {
      await NotificationService.commentAdded({
        task,
        commentBy: req.user,
        commentText: text.trim(),
        notifyUserId: task.reporter
      });
    }

    return ApiResponse.created(res, newComment, 'Comment added');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET MY TASKS ═══
exports.getMyTasks = async (req, res) => {
  try {
    const filter = { assignee: req.user._id };

    // Optional filters
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.project) {
      filter.project = req.query.project;
    }

    const tasks = await Task.find(filter)
      .populate('project', 'name key color icon')
      .populate('reporter', 'firstName lastName avatar')
      .sort({ updatedAt: -1 });

    console.log(`📋 My Tasks: Found ${tasks.length} tasks for user ${req.user._id}`);

    return ApiResponse.success(res, tasks);
  } catch (error) {
    logger.error(`Get my tasks error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};