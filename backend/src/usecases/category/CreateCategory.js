const Category = require('../../domain/entities/Category');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Create Category Use Case
 * Handles category creation business logic
 * Pure business logic, no dependencies on Express
 */

class CreateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, categoryData) {
    try {
      const { name, type, color, icon } = this.validateInput(categoryData);

      // Create category domain entity for validation
      const categoryEntity = Category.forCreation({
        userId,
        name,
        type,
        color,
        icon
      });

      // Validate category data
      const validation = categoryEntity.validateForCreation();
      if (!validation.isValid) {
        throw ApiError.validation('Category data is invalid', validation.errors);
      }

      // Prepare category data for database
      const data = {
        name: categoryEntity.name,
        type: categoryEntity.type,
        color: categoryEntity.color || '#607D8B',
        icon: categoryEntity.icon || 'folder',
        isDefault: false,
        isActive: true
      };

      // Create category in database
      const createdCategory = await this.categoryRepository.createUserCategory(userId, data);

      logger.info('Category created successfully', { 
        categoryId: createdCategory.id,
        userId,
        name: createdCategory.name,
        type: createdCategory.type
      });

      return createdCategory.toCategoryJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in CreateCategory use case:', error);
      throw ApiError.internal('Category creation failed');
    }
  }

  // Validate input data structure
  validateInput(data) {
    const required = ['name', 'type'];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
      throw ApiError.badRequest(`Missing required fields: ${missing.join(', ')}`);
    }

    // Additional input sanitization
    const sanitized = {
      name: data.name?.toString().trim(),
      type: data.type?.toString().toLowerCase(),
      color: data.color?.toString().trim(),
      icon: data.icon?.toString().trim()
    };

    // Validate type
    if (!['income', 'expense'].includes(sanitized.type)) {
      throw ApiError.badRequest('Category type must be either income or expense');
    }

    return sanitized;
  }
}

module.exports = CreateCategory;