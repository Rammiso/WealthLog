const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

const authValidators = require('./authValidators');
const categoryValidators = require('./categoryValidators');
const transactionValidators = require('./transactionValidators');
const goalValidators = require('./goalValidators');
const dashboardValidators = require('./dashboardValidators');

/**
 * Handle validation errors middleware
 * Processes express-validator results and throws ApiError if validation fails
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    throw ApiError.validation('Validation failed', errorMessages);
  }
  
  next();
};

module.exports = {
  authValidators,
  categoryValidators,
  transactionValidators,
  goalValidators,
  dashboardValidators,
  handleValidationErrors
};