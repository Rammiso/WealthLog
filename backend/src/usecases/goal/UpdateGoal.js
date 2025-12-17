const Goal = require('../../domain/entities/Goal');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Update Goal Use Case
 * Handles goal update business logic
 */

class UpdateGoal {
  constructor(goalRepository) {
    this.goalRepository = goalRepository;
  }

  async execute(userId, goalId, updateData) {
    try {
      // Check if goal exists and belongs to user
      const existingGoal = await this.goalRepository.findByIdAndUser(goalId, userId);
      
      if (!existingGoal) {
        throw ApiError.notFound('Goal not found');
      }

      const sanitizedData = this.validateInput(updateData, existingGoal);

      // Update goal in database
      const updatedGoal = await this.goalRepository.updateGoal(userId, goalId, sanitizedData);

      logger.info('Goal updated successfully', { 
        goalId,
        userId,
        updatedFields: Object.keys(sanitizedData)
      });

      return updatedGoal.toGoalJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in UpdateGoal use case:', error);
      throw ApiError.internal('Goal update failed');
    }
  }

  async updateProgress(userId, goalId, currentAmount) {
    try {
      if (typeof currentAmount !== 'number' || currentAmount < 0) {
        throw ApiError.badRequest('Current amount must be a non-negative number');
      }

      const updatedGoal = await this.goalRepository.updateProgress(userId, goalId, currentAmount);

      logger.info('Goal progress updated successfully', { 
        goalId,
        userId,
        currentAmount,
        progress: updatedGoal.progress
      });

      return updatedGoal.toGoalJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error updating goal progress:', error);
      throw ApiError.internal('Failed to update goal progress');
    }
  }

  async addToProgress(userId, goalId, amount) {
    try {
      if (typeof amount !== 'number' || amount <= 0) {
        throw ApiError.badRequest('Amount must be a positive number');
      }

      const updatedGoal = await this.goalRepository.addToProgress(userId, goalId, amount);

      logger.info('Amount added to goal progress successfully', { 
        goalId,
        userId,
        addedAmount: amount,
        newCurrentAmount: updatedGoal.currentAmount,
        progress: updatedGoal.progress
      });

      return updatedGoal.toGoalJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error adding to goal progress:', error);
      throw ApiError.internal('Failed to add to goal progress');
    }
  }

  async completeGoal(userId, goalId) {
    try {
      const completedGoal = await this.goalRepository.completeGoal(userId, goalId);

      logger.info('Goal completed successfully', { 
        goalId,
        userId,
        title: completedGoal.title
      });

      return completedGoal.toGoalJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error completing goal:', error);
      throw ApiError.internal('Failed to complete goal');
    }
  }

  async pauseGoal(userId, goalId) {
    try {
      const pausedGoal = await this.goalRepository.pauseGoal(userId, goalId);

      logger.info('Goal paused successfully', { 
        goalId,
        userId,
        title: pausedGoal.title
      });

      return pausedGoal.toGoalJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error pausing goal:', error);
      throw ApiError.internal('Failed to pause goal');
    }
  }

  async resumeGoal(userId, goalId) {
    try {
      const resumedGoal = await this.goalRepository.resumeGoal(userId, goalId);

      logger.info('Goal resumed successfully', { 
        goalId,
        userId,
        title: resumedGoal.title
      });

      return resumedGoal.toGoalJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error resuming goal:', error);
      throw ApiError.internal('Failed to resume goal');
    }
  }

  // Validate input data structure
  validateInput(data, existingGoal) {
    const sanitized = {};

    // Only include fields that are being updated
    if (data.title !== undefined) {
      sanitized.title = data.title?.toString().trim();
      
      if (!sanitized.title || sanitized.title.length < 2) {
        throw ApiError.badRequest('Goal title must be at least 2 characters long');
      }
      
      if (sanitized.title.length > 100) {
        throw ApiError.badRequest('Goal title cannot exceed 100 characters');
      }
    }

    if (data.description !== undefined) {
      sanitized.description = data.description?.toString().trim() || '';
      
      if (sanitized.description.length > 500) {
        throw ApiError.badRequest('Description cannot exceed 500 characters');
      }
    }

    if (data.targetAmount !== undefined) {
      sanitized.targetAmount = parseFloat(data.targetAmount);
      
      if (isNaN(sanitized.targetAmount) || sanitized.targetAmount <= 0) {
        throw ApiError.badRequest('Target amount must be a positive number');
      }
      
      if (sanitized.targetAmount > 999999999.99) {
        throw ApiError.badRequest('Target amount cannot exceed 999,999,999.99');
      }

      // Check if current amount would exceed new target
      if (existingGoal.currentAmount > sanitized.targetAmount) {
        throw ApiError.badRequest('Target amount cannot be less than current amount');
      }
    }

    if (data.currentAmount !== undefined) {
      sanitized.currentAmount = parseFloat(data.currentAmount);
      
      if (isNaN(sanitized.currentAmount) || sanitized.currentAmount < 0) {
        throw ApiError.badRequest('Current amount must be a non-negative number');
      }

      const targetAmount = data.targetAmount !== undefined ? sanitized.targetAmount : existingGoal.targetAmount;
      
      if (sanitized.currentAmount > targetAmount) {
        throw ApiError.badRequest('Current amount cannot exceed target amount');
      }
    }

    if (data.startDate !== undefined) {
      sanitized.startDate = new Date(data.startDate);
      
      if (isNaN(sanitized.startDate.getTime())) {
        throw ApiError.badRequest('Invalid start date format');
      }
    }

    if (data.endDate !== undefined) {
      if (data.endDate === null) {
        sanitized.endDate = null;
      } else {
        sanitized.endDate = new Date(data.endDate);
        
        if (isNaN(sanitized.endDate.getTime())) {
          throw ApiError.badRequest('Invalid end date format');
        }

        const startDate = data.startDate !== undefined ? sanitized.startDate : existingGoal.startDate;
        
        if (sanitized.endDate <= startDate) {
          throw ApiError.badRequest('End date must be after start date');
        }
      }
    }

    if (data.currency !== undefined) {
      sanitized.currency = data.currency?.toString().toUpperCase();
      
      if (!['ETB', 'USD', 'EUR', 'GBP'].includes(sanitized.currency)) {
        throw ApiError.badRequest('Currency must be one of: ETB, USD, EUR, GBP');
      }
    }

    if (data.category !== undefined) {
      sanitized.category = data.category?.toString().trim() || '';
      
      if (sanitized.category.length > 50) {
        throw ApiError.badRequest('Category name cannot exceed 50 characters');
      }
    }

    if (data.priority !== undefined) {
      sanitized.priority = data.priority?.toString().toLowerCase();
      
      if (!['low', 'medium', 'high'].includes(sanitized.priority)) {
        throw ApiError.badRequest('Priority must be one of: low, medium, high');
      }
    }

    if (data.status !== undefined) {
      sanitized.status = data.status?.toString().toLowerCase();
      
      if (!['active', 'completed', 'paused', 'cancelled'].includes(sanitized.status)) {
        throw ApiError.badRequest('Status must be one of: active, completed, paused, cancelled');
      }
    }

    return sanitized;
  }
}

module.exports = UpdateGoal;