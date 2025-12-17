const { query } = require('express-validator');
const { handleValidationErrors } = require('./index');

/**
 * Dashboard Validation Rules
 * Express-validator middleware for dashboard analytics requests
 */

// Common month/year validation
const monthYearValidation = [
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12')
    .toInt(),

  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100')
    .toInt()
];

// Validation for expenses pie chart
const expensesPieValidation = [
  ...monthYearValidation,
  handleValidationErrors
];

// Validation for income line chart
const incomeLineValidation = [
  query('months')
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage('Months must be between 1 and 24')
    .toInt(),

  handleValidationErrors
];

// Validation for category bar chart
const categoryBarValidation = [
  ...monthYearValidation,

  query('includeEmpty')
    .optional()
    .isBoolean()
    .withMessage('includeEmpty must be a boolean value')
    .toBoolean(),

  query('type')
    .optional()
    .isIn(['income', 'expense', 'both'])
    .withMessage('Type must be one of: income, expense, both'),

  handleValidationErrors
];

// Validation for goals progress
const goalsProgressValidation = [
  query('status')
    .optional()
    .isIn(['active', 'completed', 'paused', 'cancelled', 'all'])
    .withMessage('Status must be one of: active, completed, paused, cancelled, all'),

  query('includeCompleted')
    .optional()
    .isBoolean()
    .withMessage('includeCompleted must be a boolean value')
    .toBoolean(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  handleValidationErrors
];

// Validation for dashboard overview
const overviewValidation = [
  ...monthYearValidation,

  query('months')
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage('Months must be between 1 and 24')
    .toInt(),

  handleValidationErrors
];

// Validation for dashboard search/filtering
const dashboardSearchValidation = [
  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim(),

  query('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .trim(),

  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('dateFrom must be a valid date')
    .toDate(),

  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('dateTo must be a valid date')
    .toDate()
    .custom((dateTo, { req }) => {
      if (dateTo && req.query.dateFrom) {
        const dateFrom = new Date(req.query.dateFrom);
        if (dateTo <= dateFrom) {
          throw new Error('dateTo must be after dateFrom');
        }
      }
      return true;
    }),

  handleValidationErrors
];

// Validation for date range queries
const dateRangeValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid date')
    .toDate(),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid date')
    .toDate()
    .custom((endDate, { req }) => {
      if (endDate && req.query.startDate) {
        const startDate = new Date(req.query.startDate);
        if (endDate <= startDate) {
          throw new Error('endDate must be after startDate');
        }
      }
      return true;
    }),

  handleValidationErrors
];

// Validation for pagination
const paginationValidation = [
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

  handleValidationErrors
];

// Validation for currency filtering
const currencyValidation = [
  query('currency')
    .optional()
    .isIn(['ETB', 'USD', 'EUR', 'GBP'])
    .withMessage('Currency must be one of: ETB, USD, EUR, GBP')
    .toUpperCase(),

  handleValidationErrors
];

// Combined validation sets for different endpoints
const validateDashboardQuery = {
  expensesPie: expensesPieValidation,
  incomeLine: incomeLineValidation,
  categoryBar: categoryBarValidation,
  goalsProgress: goalsProgressValidation,
  overview: overviewValidation,
  search: dashboardSearchValidation,
  dateRange: dateRangeValidation,
  pagination: paginationValidation,
  currency: currencyValidation
};

// Advanced validation for complex dashboard queries
const validateAdvancedDashboard = [
  ...monthYearValidation,
  ...paginationValidation.slice(0, -1), // Remove handleValidationErrors to avoid duplicate
  ...currencyValidation.slice(0, -1), // Remove handleValidationErrors to avoid duplicate

  query('groupBy')
    .optional()
    .isIn(['category', 'month', 'week', 'day', 'type'])
    .withMessage('groupBy must be one of: category, month, week, day, type'),

  query('sortBy')
    .optional()
    .isIn(['amount', 'count', 'date', 'category', 'name'])
    .withMessage('sortBy must be one of: amount, count, date, category, name'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be either asc or desc'),

  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minAmount must be a positive number')
    .toFloat(),

  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxAmount must be a positive number')
    .toFloat()
    .custom((maxAmount, { req }) => {
      if (maxAmount && req.query.minAmount && maxAmount <= parseFloat(req.query.minAmount)) {
        throw new Error('maxAmount must be greater than minAmount');
      }
      return true;
    }),

  handleValidationErrors
];

// Validation for dashboard export requests
const validateDashboardExport = [
  query('format')
    .optional()
    .isIn(['json', 'csv', 'xlsx'])
    .withMessage('Format must be one of: json, csv, xlsx'),

  query('includeMetadata')
    .optional()
    .isBoolean()
    .withMessage('includeMetadata must be a boolean value')
    .toBoolean(),

  ...dateRangeValidation.slice(0, -1), // Remove handleValidationErrors to avoid duplicate

  handleValidationErrors
];

module.exports = {
  validateDashboardQuery,
  validateAdvancedDashboard,
  validateDashboardExport,
  monthYearValidation,
  dateRangeValidation,
  paginationValidation,
  currencyValidation
};