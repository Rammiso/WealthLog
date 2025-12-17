const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');
const jwtService = require('../../infrastructure/services/JwtService');
const { getUserRepository } = require('../../infrastructure/repositories/RepositoryFactory');

/**
 * Authentication Middleware
 * Validates JWT tokens and attaches user to request
 */

const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = jwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw ApiError.unauthorized('Access token is required');
    }

    // Verify token
    const decoded = jwtService.verifyAccessToken(token);

    // Get user repository
    const userRepository = getUserRepository();

    // Find user by ID
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      currency: user.currency,
      isActive: user.isActive,
      fullName: user.fullName,
      displayName: user.displayName
    };

    // Attach token info
    req.tokenInfo = {
      userId: decoded.userId,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    logger.error('Authentication middleware error:', error);
    return next(ApiError.unauthorized('Authentication failed'));
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      return next(); // No token, continue without user
    }

    // Try to verify token
    const decoded = jwtService.verifyAccessToken(token);
    const userRepository = getUserRepository();
    const user = await userRepository.findById(decoded.userId);

    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        currency: user.currency,
        isActive: user.isActive,
        fullName: user.fullName,
        displayName: user.displayName
      };

      req.tokenInfo = {
        userId: decoded.userId,
        email: decoded.email,
        iat: decoded.iat,
        exp: decoded.exp
      };
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    logger.debug('Optional auth failed, continuing without user:', error.message);
    next();
  }
};

/**
 * Check if user is authenticated
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }
  next();
};

/**
 * Check if user is active
 */
const requireActiveUser = (req, res, next) => {
  if (!req.user || !req.user.isActive) {
    return next(ApiError.forbidden('Active account required'));
  }
  next();
};

/**
 * Rate limiting for auth endpoints
 */
const authRateLimit = (req, res, next) => {
  // This can be implemented with express-rate-limit
  // For now, just pass through
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  requireAuth,
  requireActiveUser,
  authRateLimit
};