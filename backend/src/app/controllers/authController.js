const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');
const RegisterUser = require('../../usecases/auth/RegisterUser');
const LoginUser = require('../../usecases/auth/LoginUser');
const { getUserRepository } = require('../../infrastructure/repositories/RepositoryFactory');

/**
 * Authentication Controller
 * Handles HTTP requests/responses for authentication
 * Delegates business logic to use cases
 */

class AuthController {
  constructor() {
    this.userRepository = getUserRepository();
    const { getCategoryRepository } = require('../../infrastructure/repositories/RepositoryFactory');
    this.categoryRepository = getCategoryRepository();
    this.registerUser = new RegisterUser(this.userRepository, this.categoryRepository);
    this.loginUser = new LoginUser(this.userRepository);
  }

  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register = async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, currency } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        throw ApiError.badRequest('First name, last name, email, and password are required');
      }

      // Execute registration use case
      const result = await this.registerUser.execute({
        firstName,
        lastName,
        email,
        password,
        currency
      });

      // Log successful registration
      logger.info('User registration successful', {
        userId: result.user.id,
        email: result.user.email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Send response
      ApiResponse.created(result, 'User registered successfully').send(res);

    } catch (error) {
      // Log registration failure
      logger.warn('User registration failed', {
        email: req.body?.email,
        error: error.message,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      next(error);
    }
  };

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        throw ApiError.badRequest('Email and password are required');
      }

      // Execute login use case
      const result = await this.loginUser.execute({
        email,
        password
      });

      // Log successful login
      logger.info('User login successful', {
        userId: result.user.id,
        email: result.user.email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Send response
      ApiResponse.success(result, 'Login successful').send(res);

    } catch (error) {
      // Log login failure
      logger.warn('User login failed', {
        email: req.body?.email,
        error: error.message,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      next(error);
    }
  };

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  getProfile = async (req, res, next) => {
    try {
      // User is attached by auth middleware
      const userId = req.user.id;

      // Get full user profile
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw ApiError.notFound('User not found');
      }

      // Send user profile
      ApiResponse.success(
        user.toAuthJSON(),
        'User profile retrieved successfully'
      ).send(res);

    } catch (error) {
      logger.error('Error getting user profile:', error);
      next(error);
    }
  };

  /**
   * Update user profile
   * PUT /api/v1/auth/profile
   */
  updateProfile = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, currency } = req.body;

      // Prepare update data (only allowed fields)
      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName.trim();
      if (lastName !== undefined) updateData.lastName = lastName.trim();
      if (currency !== undefined) updateData.currency = currency.toUpperCase();

      // Validate currency if provided
      if (currency && !['ETB', 'USD', 'EUR', 'GBP'].includes(currency.toUpperCase())) {
        throw ApiError.badRequest('Invalid currency. Supported: ETB, USD, EUR, GBP');
      }

      // Update user profile
      const updatedUser = await this.userRepository.updateById(userId, updateData);

      logger.info('User profile updated', {
        userId,
        updatedFields: Object.keys(updateData)
      });

      // Send updated profile
      ApiResponse.success(
        updatedUser.toAuthJSON(),
        'Profile updated successfully'
      ).send(res);

    } catch (error) {
      logger.error('Error updating user profile:', error);
      next(error);
    }
  };

  /**
   * Logout user (client-side token removal)
   * POST /api/v1/auth/logout
   */
  logout = async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Log logout
      logger.info('User logout', {
        userId,
        email: req.user.email,
        ip: req.ip
      });

      // For JWT, logout is handled client-side by removing the token
      // In the future, we can implement token blacklisting here
      
      ApiResponse.success(
        null,
        'Logged out successfully'
      ).send(res);

    } catch (error) {
      logger.error('Error during logout:', error);
      next(error);
    }
  };

  /**
   * Check authentication status
   * GET /api/v1/auth/check
   */
  checkAuth = async (req, res, next) => {
    try {
      // If we reach here, user is authenticated (middleware passed)
      const authStatus = {
        isAuthenticated: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          fullName: req.user.fullName,
          currency: req.user.currency
        },
        tokenInfo: {
          expiresAt: new Date(req.tokenInfo.exp * 1000),
          issuedAt: new Date(req.tokenInfo.iat * 1000)
        }
      };

      ApiResponse.success(authStatus, 'Authentication status').send(res);

    } catch (error) {
      logger.error('Error checking auth status:', error);
      next(error);
    }
  };
}

// Create singleton instance
const authController = new AuthController();

module.exports = authController;