const { body, query, param, validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

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

/**
 * Goal Validation Rules
 * Express-validator middleware for goal-related requests
 */

// Validation for goal creation
const validateGoalCreation = [
  body('title')
    .notEmpty()
    .withMessage('Goal title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Goal title must be between 2 and 100 characters')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim(),

  body('targetAmount')
    .notEmpty()
    .withMessage('Target amount is required')
    .isFloat({ min: 0.01, max: 999999999.99 })
    .withMessage('Target amount must be between 0.01 and 999,999,999.99')
    .toFloat(),

  body('currentAmount')
    .optional()
    .isFloat({ min: 0, max: 999999999.99 })
    .withMessage('Current amount must be between 0 and 999,999,999.99')
    .toFloat(),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .toDate()
    .custom((endDate, { req }) => {
      if (endDate && req.body.startDate) {
        const startDate = new Date(req.body.startDate);
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),

  body('currency')
    .optional()
    .isIn(['ETB', 'USD', 'EUR', 'GBP'])
    .withMessage('Currency must be one of: ETB, USD, EUR, GBP')
    .toUpperCase(),

  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters')
    .trim(),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high')
    .toLowerCase(),

  // Custom validation to ensure current amount doesn't exceed target amount
  body('currentAmount').custom((currentAmount, { req }) => {
    if (currentAmount && req.body.targetAmount && currentAmount > req.body.targetAmount) {
      throw new Error('Current amount cannot exceed target amount');
    }
    return true;
  }),

  handleValidationErrors
];

// Validation for goal updates
const validateGoalUpdate = [
  body('title')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Goal title must be between 2 and 100 characters')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim(),

  body('targetAmount')
    .optional()
    .isFloat({ min: 0.01, max: 999999999.99 })
    .withMessage('Target amount must be between 0.01 and 999,999,999.99')
    .toFloat(),

  body('currentAmount')
    .optional()
    .isFloat({ min: 0, max: 999999999.99 })
    .withMessage('Current amount must be between 0 and 999,999,999.99')
    .toFloat(),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),

  body('endDate')
    .optional()
    .custom((endDate) => {
      if (endDate === null) return true; // Allow null to clear end date
      if (endDate && !Date.parse(endDate)) {
        throw new Error('End date must be a valid date or null');
      }
      return true;
    })
    .customSanitizer((endDate) => {
      if (endDate === null) return null;
      return new Date(endDate);
    }),

  body('currency')
    .optional()
    .isIn(['ETB', 'USD', 'EUR', 'GBP'])
    .withMessage('Currency must be one of: ETB, USD, EUR, GBP')
    .toUpperCase(),

  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters')
    .trim(),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high')
    .toLowerCase(),

  body('status')
    .optional()
    .isIn(['active', 'completed', 'paused', 'cancelled'])
    .withMessage('Status must be one of: active, completed, paused, cancelled')
    .toLowerCase(),

  handleValidationErrors
];

// Validation for progress updates
const validateProgressUpdate = [
  body('currentAmount')
    .optional()
    .isFloat({ min: 0, max: 999999999.99 })
    .withMessage('Current amount must be between 0 and 999,999,999.99')
    .toFloat(),

  body('amount')
    .optional()
    .isFloat({ min: 0.01, max: 999999999.99 })
    .withMessage('Amount must be between 0.01 and 999,999,999.99')
    .toFloat(),

  handleValidationErrors
];

// Validation for goal queries
const validateGoalQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('status')
    .optional()
    .isIn(['active', 'completed', 'paused', 'cancelled'])
    .withMessage('Status must be one of: active, completed, paused, cancelled'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  query('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .trim(),

  query('sort')
    .optional()
    .custom((sort) => {
      try {
        const parsed = JSON.parse(sort);
        if (typeof parsed !== 'object') {
          throw new Error('Sort must be a valid JSON object');
        }
        return true;
      } catch (error) {
        throw new Error('Sort must be a valid JSON object');
      }
    }),

  handleValidationErrors
];

// Validation for search queries
const validateGoalSearch = [
  query('q')
    .notEmpty()
    .withMessage('Search term (q) is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('status')
    .optional()
    .isIn(['active', 'completed', 'paused', 'cancelled'])
    .withMessage('Status must be one of: active, completed, paused, cancelled'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  query('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .trim(),

  handleValidationErrors
];

// Validation for monthly summary queries
const validateMonthlySummary = [
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12')
    .toInt(),

  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100')
    .toInt(),

  handleValidationErrors
];

// Validation for bulk operations
const validateBulkGoalIds = [
  body('goalIds')
    .isArray({ min: 1 })
    .withMessage('Goal IDs must be a non-empty array')
    .custom((goalIds) => {
      if (!goalIds.every(id => typeof id === 'string' && id.length === 24)) {
        throw new Error('All goal IDs must be valid MongoDB ObjectIds');
      }
      return true;
    }),

  handleValidationErrors
];

// Validation for goal ID parameter
const validateGoalId = [
  param('id')
    .isMongoId()
    .withMessage('Goal ID must be a valid MongoDB ObjectId'),

  handleValidationErrors
];

module.exports = {
  validateGoalCreation,
  validateGoalUpdate,
  validateProgressUpdate,
  validateGoalQuery,
  validateGoalSearch,
  validateMonthlySummary,
  validateBulkGoalIds,
  validateGoalId
};