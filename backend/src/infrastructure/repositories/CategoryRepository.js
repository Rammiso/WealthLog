const BaseRepository = require('./BaseRepository');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Category Repository
 * Handles category-specific database operations
 * Extends BaseRepository with category-specific methods
 */
class CategoryRepository extends BaseRepository {
  constructor(categoryModel) {
    super(categoryModel);
  }

  /**
   * Find categories by user (includes default categories)
   */
  async findByUser(userId, options = {}) {
    try {
      // Handle both string and object formats
      let type = null;
      if (typeof options === 'string') {
        type = options;
      } else if (options && options.type) {
        type = options.type;
      }
      
      const categories = await this.model.findByUser(userId, type);
      
      // Return in consistent format with pagination structure
      return {
        data: categories,
        pagination: {
          total: categories.length,
          page: 1,
          limit: categories.length,
          totalPages: 1
        }
      };
    } catch (error) {
      logger.error('Error finding categories by user:', error);
      throw ApiError.internal('Failed to retrieve categories');
    }
  }

  /**
   * Find category by ID (user-scoped)
   */
  async findUserCategory(userId, categoryId) {
    try {
      const category = await this.model.findUserCategory(userId, categoryId);
      
      if (!category) {
        throw ApiError.notFound('Category not found');
      }

      return category;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error finding user category:', error);
      throw ApiError.internal('Failed to find category');
    }
  }

  /**
   * Create category for user
   */
  async createUserCategory(userId, categoryData) {
    try {
      const data = {
        ...categoryData,
        userId,
        isDefault: false,
        isActive: true
      };

      return await this.create(data);
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Invalid category data', error.errors);
      }
      
      if (error.code === 11000) {
        throw ApiError.conflict('Category with this name already exists');
      }
      
      logger.error('Error creating user category:', error);
      throw ApiError.internal('Failed to create category');
    }
  }

  /**
   * Update user category
   */
  async updateUserCategory(userId, categoryId, updateData) {
    try {
      // First check if category exists and belongs to user
      const category = await this.findUserCategory(userId, categoryId);
      
      if (category.isDefault) {
        throw ApiError.forbidden('Default categories cannot be modified');
      }

      return await this.updateById(categoryId, updateData, userId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error updating user category:', error);
      throw ApiError.internal('Failed to update category');
    }
  }

  /**
   * Delete user category
   */
  async deleteUserCategory(userId, categoryId) {
    try {
      // First check if category exists and belongs to user
      const category = await this.findUserCategory(userId, categoryId);
      
      if (category.isDefault) {
        throw ApiError.forbidden('Default categories cannot be deleted');
      }

      // Check if category is being used by transactions
      const Transaction = require('../database/models/Transaction');
      const transactionCount = await Transaction.countDocuments({
        categoryId,
        userId,
        deletedAt: null
      });

      if (transactionCount > 0) {
        throw ApiError.conflict(`Cannot delete category. It is used by ${transactionCount} transaction(s)`);
      }

      return await this.deleteById(categoryId, userId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error deleting user category:', error);
      throw ApiError.internal('Failed to delete category');
    }
  }

  /**
   * Create default categories for new user
   */
  async createDefaultCategories(userId) {
    try {
      const categories = await this.model.createDefaultCategories(userId);
      logger.info(`Created ${categories.length} default categories for user ${userId}`);
      return categories;
    } catch (error) {
      logger.error('Error creating default categories:', error);
      throw ApiError.internal('Failed to create default categories');
    }
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(userId) {
    try {
      const stats = await this.model.getCategoryStats(userId);
      
      // Format the results
      const formattedStats = {
        income: { total: 0, userCreated: 0, default: 0 },
        expense: { total: 0, userCreated: 0, default: 0 }
      };

      stats.forEach(stat => {
        if (stat._id === 'income' || stat._id === 'expense') {
          formattedStats[stat._id] = {
            total: stat.count,
            userCreated: stat.userCreated,
            default: stat.defaultCategories
          };
        }
      });

      return formattedStats;
    } catch (error) {
      logger.error('Error getting category stats:', error);
      throw ApiError.internal('Failed to get category statistics');
    }
  }

  /**
   * Search categories by name
   */
  async searchCategories(userId, searchTerm, type = null) {
    try {
      const filter = {
        $or: [
          { userId, deletedAt: null },
          { isDefault: true, deletedAt: null }
        ],
        isActive: true,
        name: { $regex: searchTerm, $options: 'i' }
      };

      if (type) {
        filter.type = type;
      }

      const categories = await this.model.find(filter)
        .sort({ isDefault: -1, name: 1 })
        .limit(20);

      return categories;
    } catch (error) {
      logger.error('Error searching categories:', error);
      throw ApiError.internal('Failed to search categories');
    }
  }

  /**
   * Get categories with transaction counts
   */
  async getCategoriesWithUsage(userId, type = null) {
    try {
      const pipeline = [
        {
          $match: {
            $or: [
              { userId: userId, deletedAt: null },
              { isDefault: true, deletedAt: null }
            ],
            isActive: true,
            ...(type && { type })
          }
        },
        {
          $lookup: {
            from: 'transactions',
            let: { categoryId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$categoryId', '$$categoryId'] },
                      { $eq: ['$userId', userId] },
                      { $eq: ['$deletedAt', null] }
                    ]
                  }
                }
              }
            ],
            as: 'transactions'
          }
        },
        {
          $addFields: {
            transactionCount: { $size: '$transactions' },
            totalAmount: { $sum: '$transactions.amount' }
          }
        },
        {
          $project: {
            transactions: 0 // Remove the transactions array from output
          }
        },
        {
          $sort: { isDefault: -1, name: 1 }
        }
      ];

      const categories = await this.model.aggregate(pipeline);
      return categories;
    } catch (error) {
      logger.error('Error getting categories with usage:', error);
      throw ApiError.internal('Failed to get categories with usage data');
    }
  }

  /**
   * Validate category ownership
   */
  async validateCategoryOwnership(userId, categoryId) {
    try {
      const category = await this.findUserCategory(userId, categoryId);
      return category;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error validating category ownership:', error);
      throw ApiError.internal('Failed to validate category ownership');
    }
  }
}

module.exports = CategoryRepository;