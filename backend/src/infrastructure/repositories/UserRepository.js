const BaseRepository = require('./BaseRepository');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * User Repository
 * Handles user-specific database operations
 * Extends BaseRepository with user-specific methods
 */
class UserRepository extends BaseRepository {
  constructor(userModel) {
    super(userModel);
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    try {
      const user = await this.model.findOne({ 
        email: email.toLowerCase(),
        deletedAt: null 
      });
      
      return user;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw ApiError.internal('Failed to find user by email');
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email, excludeId = null) {
    try {
      const filter = { 
        email: email.toLowerCase(),
        deletedAt: null 
      };
      
      if (excludeId) {
        filter._id = { $ne: excludeId };
      }
      
      const user = await this.model.findOne(filter).select('_id');
      return !!user;
    } catch (error) {
      logger.error('Error checking email existence:', error);
      throw ApiError.internal('Failed to check email existence');
    }
  }

  /**
   * Create user with email validation
   */
  async createUser(userData) {
    try {
      // Check if email already exists
      const emailExists = await this.emailExists(userData.email);
      if (emailExists) {
        throw ApiError.conflict('Email already registered');
      }

      // Normalize email
      const normalizedData = {
        ...userData,
        email: userData.email.toLowerCase()
      };

      return await this.create(normalizedData);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error creating user:', error);
      throw ApiError.internal('Failed to create user');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, profileData) {
    try {
      // If email is being updated, check for conflicts
      if (profileData.email) {
        const emailExists = await this.emailExists(profileData.email, userId);
        if (emailExists) {
          throw ApiError.conflict('Email already in use');
        }
        profileData.email = profileData.email.toLowerCase();
      }

      return await this.updateById(userId, profileData);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error updating user profile:', error);
      throw ApiError.internal('Failed to update user profile');
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    try {
      // This will be expanded when we add transaction models
      const stats = {
        userId,
        profileComplete: true, // Will be calculated based on required fields
        accountAge: null, // Will be calculated from createdAt
        lastLogin: null, // Will be tracked when auth is implemented
      };

      return stats;
    } catch (error) {
      logger.error('Error getting user stats:', error);
      throw ApiError.internal('Failed to get user statistics');
    }
  }

  /**
   * Search users (admin functionality)
   */
  async searchUsers(searchTerm, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = -1
      } = options;

      const searchFilter = {
        $or: [
          { email: { $regex: searchTerm, $options: 'i' } },
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } }
        ],
        deletedAt: null
      };

      const sort = { [sortBy]: sortOrder };

      return await this.findAll(searchFilter, {
        page,
        limit,
        sort
      });
    } catch (error) {
      logger.error('Error searching users:', error);
      throw ApiError.internal('Failed to search users');
    }
  }

  /**
   * Get users by role (when roles are implemented)
   */
  async findByRole(role, options = {}) {
    try {
      const filter = { role };
      return await this.findAll(filter, options);
    } catch (error) {
      logger.error('Error finding users by role:', error);
      throw ApiError.internal('Failed to find users by role');
    }
  }

  /**
   * Deactivate user account (soft delete with additional logic)
   */
  async deactivateUser(userId) {
    try {
      // Additional logic can be added here (e.g., cleanup user data)
      const user = await this.deleteById(userId);
      
      logger.info('User account deactivated:', { userId });
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error deactivating user:', error);
      throw ApiError.internal('Failed to deactivate user account');
    }
  }

  /**
   * Reactivate user account
   */
  async reactivateUser(userId) {
    try {
      const user = await this.restoreById(userId);
      
      logger.info('User account reactivated:', { userId });
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error reactivating user:', error);
      throw ApiError.internal('Failed to reactivate user account');
    }
  }
}

module.exports = UserRepository;