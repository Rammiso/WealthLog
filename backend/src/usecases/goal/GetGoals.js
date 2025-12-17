const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Get Goals Use Case
 * Handles goal retrieval business logic
 */

class GetGoals {
  constructor(goalRepository) {
    this.goalRepository = goalRepository;
  }

  async execute(userId, options = {}) {
    try {
      const result = await this.goalRepository.findByUser(userId, options);
      
      // Convert to JSON format
      const formattedGoals = result.data.map(goal => goal.toGoalJSON());
      
      return {
        data: formattedGoals,
        pagination: result.pagination
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetGoals use case:', error);
      throw ApiError.internal('Failed to retrieve goals');
    }
  }

  async getById(userId, goalId) {
    try {
      const goal = await this.goalRepository.findByIdAndUser(goalId, userId);
      
      if (!goal) {
        throw ApiError.notFound('Goal not found');
      }

      return goal.toGoalJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error getting goal by ID:', error);
      throw ApiError.internal('Failed to retrieve goal');
    }
  }

  async getActive(userId) {
    try {
      const goals = await this.goalRepository.findActiveByUser(userId);
      return goals.map(goal => goal.toGoalJSON());

    } catch (error) {
      logger.error('Error getting active goals:', error);
      throw ApiError.internal('Failed to retrieve active goals');
    }
  }

  async getOverdue(userId) {
    try {
      const goals = await this.goalRepository.findOverdueByUser(userId);
      return goals.map(goal => goal.toGoalJSON());

    } catch (error) {
      logger.error('Error getting overdue goals:', error);
      throw ApiError.internal('Failed to retrieve overdue goals');
    }
  }

  async getSummary(userId) {
    try {
      return await this.goalRepository.getGoalSummary(userId);

    } catch (error) {
      logger.error('Error getting goal summary:', error);
      throw ApiError.internal('Failed to retrieve goal summary');
    }
  }

  async search(userId, searchTerm, options = {}) {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        throw ApiError.badRequest('Search term is required');
      }

      const result = await this.goalRepository.searchGoals(userId, searchTerm.trim(), options);
      
      // Convert to JSON format
      const formattedGoals = result.data.map(goal => goal.toGoalJSON());
      
      return {
        data: formattedGoals,
        pagination: result.pagination
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error searching goals:', error);
      throw ApiError.internal('Failed to search goals');
    }
  }

  async getByStatus(userId, status, options = {}) {
    try {
      const validStatuses = ['active', 'completed', 'paused', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        throw ApiError.badRequest(`Status must be one of: ${validStatuses.join(', ')}`);
      }

      const result = await this.goalRepository.findByStatus(userId, status, options);
      
      // Convert to JSON format
      const formattedGoals = result.data.map(goal => goal.toGoalJSON());
      
      return {
        data: formattedGoals,
        pagination: result.pagination
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(`Error getting ${status} goals:`, error);
      throw ApiError.internal(`Failed to retrieve ${status} goals`);
    }
  }

  async getByCategory(userId, category, options = {}) {
    try {
      if (!category || category.trim().length === 0) {
        throw ApiError.badRequest('Category is required');
      }

      const result = await this.goalRepository.findByCategory(userId, category.trim(), options);
      
      // Convert to JSON format
      const formattedGoals = result.data.map(goal => goal.toGoalJSON());
      
      return {
        data: formattedGoals,
        pagination: result.pagination
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error getting goals by category:', error);
      throw ApiError.internal('Failed to retrieve goals by category');
    }
  }

  async getByPriority(userId, priority, options = {}) {
    try {
      const validPriorities = ['low', 'medium', 'high'];
      
      if (!validPriorities.includes(priority)) {
        throw ApiError.badRequest(`Priority must be one of: ${validPriorities.join(', ')}`);
      }

      const result = await this.goalRepository.findByPriority(userId, priority, options);
      
      // Convert to JSON format
      const formattedGoals = result.data.map(goal => goal.toGoalJSON());
      
      return {
        data: formattedGoals,
        pagination: result.pagination
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(`Error getting ${priority} priority goals:`, error);
      throw ApiError.internal(`Failed to retrieve ${priority} priority goals`);
    }
  }
}

module.exports = GetGoals;