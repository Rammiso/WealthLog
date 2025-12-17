const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Delete Category Use Case
 * Handles category deletion business logic
 * Pure business logic, no dependencies on Express
 */

class DeleteCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, categoryId) {
    try {
      // Validate category ID format
      if (!categoryId || typeof categoryId !== 'string') {
        throw ApiError.badRequest('Valid category ID is required');
      }

      // Check if category exists and belongs to user
      const category = await this.categoryRepository.findUserCategory(userId, categoryId);

      if (category.isDefault) {
        throw ApiError.forbidden('Default categories cannot be deleted');
      }

      // Delete category (this will check for transaction usage)
      const deletedCategory = await this.categoryRepository.deleteUserCategory(userId, categoryId);

      logger.info('Category deleted successfully', { 
        categoryId,
        userId,
        categoryName: deletedCategory.name
      });

      return {
        id: deletedCategory.id,
        name: deletedCategory.name,
        type: deletedCategory.type,
        deletedAt: deletedCategory.deletedAt
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in DeleteCategory use case:', error);
      throw ApiError.internal('Category deletion failed');
    }
  }

  // Soft delete (mark as inactive instead of deleting)
  async deactivate(userId, categoryId) {
    try {
      // Validate category ID format
      if (!categoryId || typeof categoryId !== 'string') {
        throw ApiError.badRequest('Valid category ID is required');
      }

      // Check if category exists and belongs to user
      const category = await this.categoryRepository.findUserCategory(userId, categoryId);

      if (category.isDefault) {
        throw ApiError.forbidden('Default categories cannot be deactivated');
      }

      // Update category to inactive
      const updatedCategory = await this.categoryRepository.updateUserCategory(
        userId, 
        categoryId, 
        { isActive: false }
      );

      logger.info('Category deactivated successfully', { 
        categoryId,
        userId,
        categoryName: updatedCategory.name
      });

      return updatedCategory.toCategoryJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in DeleteCategory deactivate:', error);
      throw ApiError.internal('Category deactivation failed');
    }
  }

  // Reactivate category
  async reactivate(userId, categoryId) {
    try {
      // Validate category ID format
      if (!categoryId || typeof categoryId !== 'string') {
        throw ApiError.badRequest('Valid category ID is required');
      }

      // Update category to active
      const updatedCategory = await this.categoryRepository.updateUserCategory(
        userId, 
        categoryId, 
        { isActive: true }
      );

      logger.info('Category reactivated successfully', { 
        categoryId,
        userId,
        categoryName: updatedCategory.name
      });

      return updatedCategory.toCategoryJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in DeleteCategory reactivate:', error);
      throw ApiError.internal('Category reactivation failed');
    }
  }
}

module.exports = DeleteCategory;