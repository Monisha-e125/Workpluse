const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value
    }));

    // ✅ ADD THIS LOG — shows exactly what's failing
    console.log('❌ Validation Errors:', JSON.stringify(formattedErrors, null, 2));
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));

    return ApiResponse.validationError(res, formattedErrors);
  }

  next();
};

module.exports = { validate };