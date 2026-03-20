const { body } = require('express-validator');

const createProjectRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description max 500 characters'),

  body('color').optional().trim(),
  body('icon').optional().trim(),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

const updateProjectRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description max 500 characters'),

  body('status')
    .optional()
    .isIn(['active', 'on-hold', 'completed', 'archived'])
    .withMessage('Invalid status')
];

module.exports = { createProjectRules, updateProjectRules };