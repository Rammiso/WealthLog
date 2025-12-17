const { HTTP_STATUS, ERROR_TYPES } = require('../config/constants');

class ApiError extends Error {
  constructor(
    message,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorType = ERROR_TYPES.INTERNAL_ERROR,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Static factory methods for common errors
  static badRequest(message = 'Bad Request') {
    return new ApiError(message, HTTP_STATUS.BAD_REQUEST, ERROR_TYPES.VALIDATION_ERROR);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, HTTP_STATUS.UNAUTHORIZED, ERROR_TYPES.AUTHENTICATION_ERROR);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(message, HTTP_STATUS.FORBIDDEN, ERROR_TYPES.AUTHORIZATION_ERROR);
  }

  static notFound(message = 'Not Found') {
    return new ApiError(message, HTTP_STATUS.NOT_FOUND, ERROR_TYPES.NOT_FOUND_ERROR);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(message, HTTP_STATUS.CONFLICT, ERROR_TYPES.CONFLICT_ERROR);
  }

  static tooManyRequests(message = 'Too Many Requests') {
    return new ApiError(message, HTTP_STATUS.TOO_MANY_REQUESTS, ERROR_TYPES.RATE_LIMIT_ERROR);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_TYPES.INTERNAL_ERROR);
  }

  static validation(message = 'Validation Error', details = null) {
    const error = new ApiError(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_TYPES.VALIDATION_ERROR);
    if (details) {
      error.details = details;
    }
    return error;
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      error: {
        type: this.errorType,
        message: this.message,
        statusCode: this.statusCode,
        timestamp: this.timestamp,
        ...(this.details && { details: this.details })
      }
    };
  }
}

module.exports = ApiError;