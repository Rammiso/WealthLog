const errorHandler = require('./errorHandler');
const notFound = require('./notFound');
const requestLogger = require('./requestLogger');
const { authenticate, optionalAuth, requireAuth, requireActiveUser, authRateLimit } = require('./auth');

module.exports = {
  errorHandler,
  notFound,
  requestLogger,
  authenticate,
  optionalAuth,
  requireAuth,
  requireActiveUser,
  authRateLimit
};