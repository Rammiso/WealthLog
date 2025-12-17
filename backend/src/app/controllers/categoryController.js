const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');
const CreateCategory = require('../../usecases/category/CreateCategory');
const GetCategories = require('../../usecases/category/GetCategories');
const UpdateCategory = require('../../usecases/category/UpdateCategory');
const DeleteCategory = require('../../usecases/category/DeleteCategory');
const { getCategoryRepository } = require('../../infrastructure/repositories/RepositoryFactory');

/**
 * Category Controller
 * Handles HTTP requests/responses for categories
 * Delegates business logic to use cases
 */

class CategoryController {
  constructor() {
    this.categoryRepository = getCategoryRepository();
    this.createCategory = new CreateCategory(this.categoryRepository);
    this.getCategories = new GetCategories(this.categoryRepository);
    this.updateCategory = new UpdateCategory(this.categoryRepository);
    this.deleteCategory = new DeleteCategory(this.categoryRepository);
  }

  /**
   * Create new category
   * POST /api/v1/categories
   */
  create = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name, type, color, icon } = req.body;

      // Validate required fields
      if (!name || !type) {
        throw ApiError.badRequest('Name and type are required');
      }

      // Execute create category use case
      const result = await this.createCategory.execute(userId, {
        name,
        type,
        color,
        icon
      });

      // Log successful creation
      logger.info('Category creation successful', {
        categoryId: result.id,
        userId,
        name: result.name,
        type: result.type,
        ip: req.ip
      });

      // Send response
      ApiResponse.created(result, 'Category created successfully').send(res);

    } catch (error) {
      logger.warn('Category creation failed', {
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Get user categories
   * GET /api/v1/categories
   */
  getAll = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { type, includeUsage } = req.query;

      // Execute get categories use case
      const result = await this.getCategories.execute(userId, {
        type,
        includeUsage: includeUsage === 'true'
      });

      // Send response
      ApiResponse.success(result, 'Categories retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting categories:', error);
      next(error);
    }
  };

  /**
   * Get category by ID
   * GET /api/v1/categories/:id
   */
  getById = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Find category
      const category = await this.categoryRepository.findUserCategory(userId, id);

      // Send response
      ApiResponse.success(
        category.toCategoryJSON(),
        'Category retrieved successfully'
      ).send(res);

    } catch (error) {
      logger.error('Error getting category by ID:', error);
      next(error);
    }
  };

  /**
   * Update category
   * PUT /api/v1/categories/:id
   */
  update = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { name, color, icon, isActive } = req.body;

      // Execute update category use case
      const result = await this.updateCategory.execute(userId, id, {
        name,
        color,
        icon,
        isActive
      });

      logger.info('Category update successful', {
        categoryId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Category updated successfully').send(res);

    } catch (error) {
      logger.warn('Category update failed', {
        categoryId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Delete category
   * DELETE /api/v1/categories/:id
   */
  delete = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute delete category use case
      const result = await this.deleteCategory.execute(userId, id);

      logger.info('Category deletion successful', {
        categoryId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Category deleted successfully').send(res);

    } catch (error) {
      logger.warn('Category deletion failed', {
        categoryId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Get category statistics
   * GET /api/v1/categories/stats
   */
  getStats = async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Execute get stats use case
      const result = await this.getCategories.getStats(userId);

      // Send response
      ApiResponse.success(result, 'Category statistics retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting category stats:', error);
      next(error);
    }
  };

  /**
   * Search categories
   * GET /api/v1/categories/search
   */
  search = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { q: searchTerm, type } = req.query;

      if (!searchTerm) {
        throw ApiError.badRequest('Search term (q) is required');
      }

      // Execute search use case
      const result = await this.getCategories.search(userId, searchTerm, type);

      // Send response
      ApiResponse.success(result, 'Category search completed').send(res);

    } catch (error) {
      logger.error('Error searching categories:', error);
      next(error);
    }
  };

  /**
   * Deactivate category
   * PATCH /api/v1/categories/:id/deactivate
   */
  deactivate = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute deactivate use case
      const result = await this.deleteCategory.deactivate(userId, id);

      logger.info('Category deactivation successful', {
        categoryId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Category deactivated successfully').send(res);

    } catch (error) {
      logger.warn('Category deactivation failed', {
        categoryId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Reactivate category
   * PATCH /api/v1/categories/:id/reactivate
   */
  reactivate = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute reactivate use case
      const result = await this.deleteCategory.reactivate(userId, id);

      logger.info('Category reactivation successful', {
        categoryId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Category reactivated successfully').send(res);

    } catch (error) {
      logger.warn('Category reactivation failed', {
        categoryId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Create default categories for user
   * POST /api/v1/categories/defaults
   */
  createDefaults = async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Create default categories
      const result = await this.categoryRepository.createDefaultCategories(userId);

      logger.info('Default categories creation successful', {
        userId,
        count: result.length,
        ip: req.ip
      });

      // Send response
      ApiResponse.created(
        { count: result.length, categories: result },
        'Default categories created successfully'
      ).send(res);

    } catch (error) {
      logger.warn('Default categories creation failed', {
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };
}

// Create singleton instance
const categoryController = new CategoryController();

module.exports = categoryController;