const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Delete Goal Use Case
 * Handles goal deletion business logic
 */

class DeleteGoal {
  constructor(goalRepository) {
    this.goalRepository = goalRepository;
  }

  async execute(userId, goalId) {
    try {
      // Check if goal exists and belongs to user
      const goal = await this.goalRepository.findByIdAndUser(goalId, userId);
      
      if (!goal) {
        throw ApiError.notFound('Goal not found');
      }

      // Soft delete the goal
      const deletedGoal = await this.goalRepository.softDelete(goalId, userId);

      logger.info('Goal deleted successfully', { 
        goalId,
        userId,
        title: goal.title
      });

      return {
        id: goalId,
        message: 'Goal deleted successfully',
        deletedAt: deletedGoal.deletedAt
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in DeleteGoal use case:', error);
      throw ApiError.internal('Goal deletion failed');
    }
  }

  async bulkDelete(userId, goalIds) {
    try {
      if (!Array.isArray(goalIds) || goalIds.length === 0) {
        throw ApiError.badRequest('Goal IDs array is required and cannot be empty');
      }

      const results = {
        successful: [],
        failed: [],
        summary: {
          total: goalIds.length,
          successful: 0,
          failed: 0
        }
      };

      // Process each goal deletion
      for (const goalId of goalIds) {
        try {
          const result = await this.execute(userId, goalId);
          results.successful.push({
            goalId,
            message: result.message,
            deletedAt: result.deletedAt
          });
          results.summary.successful++;
        } catch (error) {
          results.failed.push({
            goalId,
            error: error.message
          });
          results.summary.failed++;
        }
      }

      logger.info('Bulk goal deletion completed', {
        userId,
        total: results.summary.total,
        successful: results.summary.successful,
        failed: results.summary.failed
      });

      return results;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in bulk goal deletion:', error);
      throw ApiError.internal('Bulk goal deletion failed');
    }
  }

  async restore(userId, goalId) {
    try {
      // Check if goal exists (including soft deleted ones)
      const goal = await this.goalRepository.findById(goalId);
      
      if (!goal) {
        throw ApiError.notFound('Goal not found');
      }

      if (!goal.belongsToUser(userId)) {
        throw ApiError.forbidden('Access denied');
      }

      if (!goal.isDeleted()) {
        throw ApiError.badRequest('Goal is not deleted');
      }

      // Restore the goal
      const restoredGoal = await goal.restore();

      logger.info('Goal restored successfully', { 
        goalId,
        userId,
        title: restoredGoal.title
      });

      return restoredGoal.toGoalJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error restoring goal:', error);
      throw ApiError.internal('Goal restoration failed');
    }
  }

  async permanentDelete(userId, goalId) {
    try {
      // Check if goal exists and belongs to user
      const goal = await this.goalRepository.findById(goalId);
      
      if (!goal) {
        throw ApiError.notFound('Goal not found');
      }

      if (!goal.belongsToUser(userId)) {
        throw ApiError.forbidden('Access denied');
      }

      // Permanently delete the goal
      await this.goalRepository.permanentDelete(goalId);

      logger.info('Goal permanently deleted', { 
        goalId,
        userId,
        title: goal.title
      });

      return {
        id: goalId,
        message: 'Goal permanently deleted'
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error permanently deleting goal:', error);
      throw ApiError.internal('Permanent goal deletion failed');
    }
  }
}

module.exports = DeleteGoal;