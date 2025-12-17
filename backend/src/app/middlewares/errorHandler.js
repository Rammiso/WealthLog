const { logger } = require('../../utils/logger');
const ApiError = require('../../utils/ApiError');
const { HTTP_STATUS, ERROR_TYPES } = require('../../config/constants');
const config = require('../../config/env');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Convert non-ApiError to ApiError
  if (!(error instanceof ApiError)) {
    // Handle specific error types
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = ApiError.validation(message);
    } else if (err.name === 'CastError') {
      // Mongoose cast error (invalid ObjectId)
      error = ApiError.badRequest('Invalid resource ID');
    } else if (err.code === 11000) {
      // MongoDB duplicate key error
      const field = Object.keys(err.keyValue)[0];
      error = ApiError.conflict(`${field} already exists`);
    } else if (err.name === 'JsonWebTokenError') {
      // JWT error
      error = ApiError.unauthorized('Invalid token');
    } else if (err.name === 'TokenExpiredError') {
      // JWT expired
      error = ApiError.unauthorized('Token expired');
    } else {
      // Generic error
      error = ApiError.internal('Something went wrong');
    }
  }

  // Prepare response
  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    timestamp: new Date().toISOString()
  };

  // Add error details in development
  if (config.isDevelopment()) {
    response.error = {
      type: error.errorType || ERROR_TYPES.INTERNAL_ERROR,
      stack: error.stack
    };
    
    if (error.details) {
      response.error.details = error.details;
    }
  }

  // Send error response
  res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};

module.exports = errorHandler;