const { body, param, query, validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

/**
 * Category Validators
 * Express-validator rules for category endpoints
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

// Create category validation rules
const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s&-]+$/)
    .withMessage('Category name can only contain letters, numbers, spaces, ampersands, and hyphens'),

  body('type')
    .notEmpty()
    .withMessage('Category type is required')
    .isIn(['income', 'expense'])
    .withMessage('Category type must be either income or expense'),

  body('color')
    .optional()
    .trim()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color (e.g., #FF5733)'),

  body('icon')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Icon must contain only letters, numbers, hyphens, and underscores')
    .isLength({ max: 50 })
    .withMessage('Icon name cannot exceed 50 characters'),

  handleValidationErrors
];

// Update category validation rules
const validateUpdateCategory = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s&-]+$/)
    .withMessage('Category name can only contain letters, numbers, spaces, ampersands, and hyphens'),

  body('color')
    .optional()
    .trim()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color (e.g., #FF5733)'),

  body('icon')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Icon must contain only letters, numbers, hyphens, and underscores')
    .isLength({ max: 50 })
    .withMessage('Icon name cannot exceed 50 characters'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),

  // Prevent type changes
  body('type')
    .not()
    .exists()
    .withMessage('Category type cannot be changed after creation'),

  handleValidationErrors
];

// Category ID parameter validation
const validateCategoryId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID'),

  handleValidationErrors
];

// Get categories query validation
const validateGetCategories = [
  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  query('includeUsage')
    .optional()
    .isBoolean()
    .withMessage('includeUsage must be a boolean value'),

  handleValidationErrors
];

// Search categories validation
const validateSearchCategories = [
  query('q')
    .notEmpty()
    .withMessage('Search term (q) is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim(),

  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),

  handleValidationErrors
];

module.exports = {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryId,
  validateGetCategories,
  validateSearchCategories,
  handleValidationErrors
};