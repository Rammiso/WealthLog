const { body, param, query, validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

/**
 * Transaction Validators
 * Express-validator rules for transaction endpoints
 */

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    throw ApiError.validation('Validation failed', errorMessages);
  }
  
  next();
};

// Create transaction validation rules
const validateCreateTransaction = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01, max: 999999999.99 })
    .withMessage('Amount must be between 0.01 and 999,999,999.99')
    .custom((value) => {
      // Check for valid decimal places (max 2)
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Amount must have at most 2 decimal places');
      }
      return true;
    }),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),

  body('categoryId')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be in valid ISO 8601 format')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      
      if (date < oneYearAgo || date > oneYearFromNow) {
        throw new Error('Date must be within one year from today');
      }
      return true;
    }),

  body('type')
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['income', 'expense'])
    .withMessage('Transaction type must be either income or expense'),

  body('currency')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(['ETB', 'USD', 'EUR', 'GBP'])
    .withMessage('Currency must be one of: ETB, USD, EUR, GBP'),

  handleValidationErrors
];

// Update transaction validation rules
const validateUpdateTransaction = [
  param('id')
    .isMongoId()
    .withMessage('Invalid transaction ID'),

  body('amount')
    .optional()
    .isFloat({ min: 0.01, max: 999999999.99 })
    .withMessage('Amount must be between 0.01 and 999,999,999.99')
    .custom((value) => {
      if (value !== undefined) {
        const decimalPlaces = (value.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) {
          throw new Error('Amount must have at most 2 decimal places');
        }
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),

  body('categoryId')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO 8601 format')
    .custom((value) => {
      if (value) {
        const date = new Date(value);
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        
        if (date < oneYearAgo || date > oneYearFromNow) {
          throw new Error('Date must be within one year from today');
        }
      }
      return true;
    }),

  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Transaction type must be either income or expense'),

  body('currency')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(['ETB', 'USD', 'EUR', 'GBP'])
    .withMessage('Currency must be one of: ETB, USD, EUR, GBP'),

  handleValidationErrors
];

// Transaction ID parameter validation
const validateTransactionId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid transaction ID'),

  handleValidationErrors
];

// Get transactions query validation
const validateGetTransactions = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  query('categoryId')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in valid ISO 8601 format'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in valid ISO 8601 format'),

  handleValidationErrors
];

// Search transactions validation
const validateSearchTransactions = [
  query('q')
    .notEmpty()
    .withMessage('Search term (q) is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  handleValidationErrors
];

// Summary query validation
const validateSummaryQuery = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'year'])
    .withMessage('Period must be one of: week, month, year'),

  handleValidationErrors
];

// Bulk delete validation
const validateBulkDelete = [
  body('transactionIds')
    .isArray({ min: 1, max: 100 })
    .withMessage('Transaction IDs must be an array with 1-100 items'),

  body('transactionIds.*')
    .isMongoId()
    .withMessage('Each transaction ID must be valid'),

  handleValidationErrors
];

// Recent transactions validation
const validateRecentTransactions = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  handleValidationErrors
];

module.exports = {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateTransactionId,
  validateGetTransactions,
  validateSearchTransactions,
  validateSummaryQuery,
  validateBulkDelete,
  validateRecentTransactions,
  handleValidationErrors
};