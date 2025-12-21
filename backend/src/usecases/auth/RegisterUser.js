const User = require('../../domain/entities/User');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');
const passwordService = require('../../infrastructure/services/PasswordService');
const jwtService = require('../../infrastructure/services/JwtService');

/**
 * Register User Use Case
 * Handles user registration business logic
 * Pure business logic, no dependencies on Express
 */

class RegisterUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(registrationData) {
    try {
      const { firstName, lastName, email, password, currency = 'ETB' } = registrationData;

      // Create user domain entity for validation
      const userEntity = User.forRegistration({
        firstName,
        lastName,
        email,
        currency
      });

      // Validate user data
      const validation = userEntity.validateForRegistration();
      if (!validation.isValid) {
        throw ApiError.validation('Registration data is invalid', validation.errors);
      }

      // Validate password separately (not part of domain entity)
      passwordService.validatePasswordStrength(password);

      // Check if email already exists
      const emailExists = await this.userRepository.emailExists(email);
      if (emailExists) {
        throw ApiError.conflict('Email address is already registered');
      }

      // Prepare user data for database (password will be hashed by User model pre-save middleware)
      const userData = {
        firstName: userEntity.firstName,
        lastName: userEntity.lastName,
        email: userEntity.email,
        password: password, // Raw password - will be hashed by User model
        currency: userEntity.currency,
        isActive: true,
        authProvider: 'local'
      };

      // Create user in database
      const createdUser = await this.userRepository.create(userData);

      // Generate JWT tokens
      const tokenPayload = {
        userId: createdUser.id,
        email: createdUser.email
      };

      const tokens = jwtService.generateTokenPair(tokenPayload);

      // Update last login
      await createdUser.updateLastLogin();

      // Prepare response data
      const responseData = {
        user: createdUser.toAuthJSON(),
        tokens: {
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn
        }
      };

      logger.info('User registered successfully', { 
        userId: createdUser.id,
        email: createdUser.email 
      });

      return responseData;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in RegisterUser use case:', error);
      throw ApiError.internal('Registration failed');
    }
  }

  // Validate registration data structure
  validateInput(data) {
    const required = ['firstName', 'lastName', 'email', 'password'];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
      throw ApiError.badRequest(`Missing required fields: ${missing.join(', ')}`);
    }

    // Additional input sanitization
    const sanitized = {
      firstName: data.firstName?.toString().trim(),
      lastName: data.lastName?.toString().trim(),
      email: data.email?.toString().toLowerCase().trim(),
      password: data.password?.toString(),
      currency: data.currency?.toString().toUpperCase() || 'ETB'
    };

    return sanitized;
  }
}

module.exports = RegisterUser;