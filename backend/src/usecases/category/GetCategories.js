const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Get Categories Use Case
 * Handles retrieving user categories business logic
 * Pure business logic, no dependencies on Express
 */

class GetCategories {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, options = {}) {
    try {
      const { type, includeUsage = false } = options;

      let categories;

      if (includeUsage) {
        // Get categories with transaction usage data
        categories = await this.categoryRepository.getCategoriesWithUsage(userId, type);
      } else {
        // Get basic categories
        categories = await this.categoryRepository.findByUser(userId, type);
      }

      // Format response
      const formattedCategories = categories.map(category => {
        const categoryData = category.toCategoryJSON ? category.toCategoryJSON() : category;
        
        if (includeUsage) {
          categoryData.usage = {
            transactionCount: category.transactionCount || 0,
            totalAmount: category.totalAmount || 0
          };
        }
        
        return categoryData;
      });

      logger.info('Categories retrieved successfully', { 
        userId,
        count: formattedCategories.length,
        type: type || 'all'
      });

      return formattedCategories;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetCategories use case:', error);
      throw ApiError.internal('Failed to retrieve categories');
    }
  }

  // Get category statistics
  async getStats(userId) {
    try {
      const stats = await this.categoryRepository.getCategoryStats(userId);
      
      logger.info('Category stats retrieved successfully', { userId });
      return stats;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetCategories stats:', error);
      throw ApiError.internal('Failed to retrieve category statistics');
    }
  }

  // Search categories
  async search(userId, searchTerm, type = null) {
    try {
      if (!searchTerm || searchTerm.trim().length < 1) {
        throw ApiError.badRequest('Search term is required');
      }

      const categories = await this.categoryRepository.searchCategories(
        userId, 
        searchTerm.trim(), 
        type
      );

      const formattedCategories = categories.map(category => 
        category.toCategoryJSON ? category.toCategoryJSON() : category
      );

      logger.info('Category search completed', { 
        userId,
        searchTerm,
        resultCount: formattedCategories.length
      });

      return formattedCategories;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetCategories search:', error);
      throw ApiError.internal('Failed to search categories');
    }
  }
}

module.exports = GetCategories;