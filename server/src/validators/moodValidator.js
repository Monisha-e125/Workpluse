const { body } = require('express-validator');

const moodCheckInRules = [
  body('mood')
    .notEmpty().withMessage('Mood is required')
    .isInt({ min: 1, max: 5 }).withMessage('Mood must be 1-5'),

  body('project')
    .optional()
    .isMongoId().withMessage('Invalid project ID'),

  body('factors')
    .optional()
    .isArray().withMessage('Factors must be an array'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Note max 500 characters')
];

module.exports = { moodCheckInRules };