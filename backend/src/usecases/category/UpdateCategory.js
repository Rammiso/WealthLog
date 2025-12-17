const Category = require('../../domain/entities/Category');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Update Category Use Case
 * Handles category update business logic
 * Pure business logic, no dependencies on Express
 */

class UpdateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, categoryId, updateData) {
    try {
      const sanitizedData = this.validateInput(updateData);

      // Check if category exists and belongs to user
      const existingCategory = await this.categoryRepository.findUserCategory(userId, categoryId);

      if (existingCategory.isDefault) {
        throw ApiError.forbidden('Default categories cannot be modified');
      }

      // Create category entity for validation
      const categoryEntity = Category.forCreation({
        userId,
        name: sanitizedData.name || existingCategory.name,
        type: sanitizedData.type || existingCategory.type,
        color: sanitizedData.color || existingCategory.color,
        icon: sanitizedData.icon || existingCategory.icon
      });

      // Validate updated category data
      const validation = categoryEntity.validateForUpdate();
      if (!validation.isValid) {
        throw ApiError.validation('Category update data is invalid', validation.errors);
      }

      // Prepare update data (only include provided fields)
      const updateFields = {};
      if (sanitizedData.name !== undefined) updateFields.name = sanitizedData.name;
      if (sanitizedData.color !== undefined) updateFields.color = sanitizedData.color;
      if (sanitizedData.icon !== undefined) updateFields.icon = sanitizedData.icon;
      if (sanitizedData.isActive !== undefined) updateFields.isActive = sanitizedData.isActive;

      // Update category in database
      const updatedCategory = await this.categoryRepository.updateUserCategory(
        userId, 
        categoryId, 
        updateFields
      );

      logger.info('Category updated successfully', { 
        categoryId,
        userId,
        updatedFields: Object.keys(updateFields)
      });

      return updatedCategory.toCategoryJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in UpdateCategory use case:', error);
      throw ApiError.internal('Category update failed');
    }
  }

  // Validate input data structure
  validateInput(data) {
    // Sanitize input data
    const sanitized = {};

    if (data.name !== undefined) {
      sanitized.name = data.name?.toString().trim();
      if (sanitized.name.length < 1) {
        throw ApiError.badRequest('Category name cannot be empty');
      }
      if (sanitized.name.length > 50) {
        throw ApiError.badRequest('Category name cannot exceed 50 characters');
      }
    }

    if (data.color !== undefined) {
      sanitized.color = data.color?.toString().trim();
      if (sanitized.color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(sanitized.color)) {
        throw ApiError.badRequest('Color must be a valid hex color (e.g., #FF5733)');
      }
    }

    if (data.icon !== undefined) {
      sanitized.icon = data.icon?.toString().trim();
      if (sanitized.icon && !/^[a-zA-Z0-9_-]+$/.test(sanitized.icon)) {
        throw ApiError.badRequest('Icon must contain only letters, numbers, hyphens, and underscores');
      }
    }

    if (data.isActive !== undefined) {
      sanitized.isActive = Boolean(data.isActive);
    }

    // Prevent type changes
    if (data.type !== undefined) {
      throw ApiError.badRequest('Category type cannot be changed after creation');
    }

    return sanitized;
  }
}

module.exports = UpdateCategory;