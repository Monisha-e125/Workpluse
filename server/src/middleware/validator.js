const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Validation middleware — runs after express-validator rules
 * Returns 422 if validation fails
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    logger.warn(
      `Validation failed: ${req.method} ${req.originalUrl} — ${JSON.stringify(extractedErrors)}`
    );

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: extractedErrors
    });
  }

  next();
};

module.exports = { validate };