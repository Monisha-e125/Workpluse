const { body } = require('express-validator');

const createTaskRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be 2-200 characters'),

  body('project')
    .notEmpty().withMessage('Project ID is required')
    .isMongoId().withMessage('Invalid project ID'),

  body('priority')
    .optional()
    .isIn(['critical', 'high', 'medium', 'low'])
    .withMessage('Invalid priority'),

  body('type')
    .optional()
    .isIn(['feature', 'bug', 'improvement', 'task', 'epic'])
    .withMessage('Invalid task type'),

  body('status')
    .optional()
    .isIn(['backlog', 'todo', 'in-progress', 'in-review', 'testing', 'done'])
    .withMessage('Invalid status'),

  body('storyPoints')
    .optional()
    .isIn([1, 2, 3, 5, 8, 13, 21])
    .withMessage('Invalid story points'),

  body('assignee').optional().isMongoId().withMessage('Invalid assignee ID'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
];

const updateTaskRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Title must be 2-200 characters'),

  body('status')
    .optional()
    .isIn(['backlog', 'todo', 'in-progress', 'in-review', 'testing', 'done'])
    .withMessage('Invalid status')
];

module.exports = { createTaskRules, updateTaskRules };