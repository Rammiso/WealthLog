const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');
const passwordService = require('../../infrastructure/services/PasswordService');
const jwtService = require('../../infrastructure/services/JwtService');

/**
 * Login User Use Case
 * Handles user authentication business logic
 * Pure business logic, no dependencies on Express
 */

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(loginData) {
    try {
      const { email, password } = this.validateInput(loginData);

      // Find user by email (with password field)
      const user = await this.findUserForAuthentication(email);

      // Verify password
      const isPasswordValid = await passwordService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        // Log failed login attempt
        logger.warn('Failed login attempt', { 
          email,
          reason: 'invalid_password',
          timestamp: new Date().toISOString()
        });
        
        throw ApiError.unauthorized('Invalid email or password');
      }

      // Check if user account is active
      if (!user.isActive) {
        logger.warn('Login attempt on inactive account', { 
          userId: user.id,
          email: user.email 
        });
        
        throw ApiError.forbidden('Account is deactivated. Please contact support.');
      }

      // Generate JWT tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email
      };

      const tokens = jwtService.generateTokenPair(tokenPayload);

      // Update last login timestamp
      await user.updateLastLogin();

      // Prepare response data (exclude password)
      const responseData = {
        user: user.toAuthJSON(),
        tokens: {
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn
        }
      };

      logger.info('User logged in successfully', { 
        userId: user.id,
        email: user.email,
        lastLogin: user.lastLoginAt
      });

      return responseData;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in LoginUser use case:', error);
      throw ApiError.internal('Login failed');
    }
  }

  // Find user for authentication (includes password field)
  async findUserForAuthentication(email) {
    try {
      // Use repository method that includes password
      const user = await this.userRepository.model.findByEmailWithPassword(email);

      if (!user) {
        // Log failed login attempt
        logger.warn('Failed login attempt', { 
          email,
          reason: 'user_not_found',
          timestamp: new Date().toISOString()
        });
        
        throw ApiError.unauthorized('Invalid email or password');
      }

      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error finding user for authentication:', error);
      throw ApiError.internal('Authentication failed');
    }
  }

  // Validate login input
  validateInput(data) {
    if (!data.email || !data.password) {
      throw ApiError.badRequest('Email and password are required');
    }

    // Sanitize input
    const sanitized = {
      email: data.email.toString().toLowerCase().trim(),
      password: data.password.toString()
    };

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized.email)) {
      throw ApiError.badRequest('Please provide a valid email address');
    }

    return sanitized;
  }

  // Check if account is locked (for future implementation)
  async isAccountLocked(userId) {
    // This can be implemented later with failed attempt tracking
    return false;
  }

  // Record failed login attempt (for future implementation)
  async recordFailedAttempt(email, reason) {
    // This can be implemented later for security monitoring
    logger.warn('Failed login attempt recorded', { email, reason });
  }
}

module.exports = LoginUser;