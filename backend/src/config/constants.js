// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// API Response Messages
const MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later'
};

// Error Types
const ERROR_TYPES = {
  VALIDATION_ERROR: 'ValidationError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  NOT_FOUND_ERROR: 'NotFoundError',
  CONFLICT_ERROR: 'ConflictError',
  RATE_LIMIT_ERROR: 'RateLimitError',
  INTERNAL_ERROR: 'InternalError'
};

// Currency Codes
const CURRENCIES = {
  ETB: 'ETB',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP'
};

// Transaction Types
const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// User Roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Default Categories
const DEFAULT_CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Other Income'
  ],
  EXPENSE: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other Expenses'
  ]
};

// Goal Types
const GOAL_TYPES = {
  SAVINGS: 'savings',
  DEBT_PAYOFF: 'debt_payoff',
  INVESTMENT: 'investment',
  EMERGENCY_FUND: 'emergency_fund',
  OTHER: 'other'
};

// Goal Status
const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
};

// Validation Rules
const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  AMOUNT_MIN: 0.01,
  AMOUNT_MAX: 999999999.99
};

// Rate Limiting
const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 attempts per window
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 100 requests per window
  }
};

module.exports = {
  HTTP_STATUS,
  MESSAGES,
  ERROR_TYPES,
  CURRENCIES,
  TRANSACTION_TYPES,
  USER_ROLES,
  DEFAULT_CATEGORIES,
  GOAL_TYPES,
  GOAL_STATUS,
  VALIDATION_RULES,
  RATE_LIMITS
};