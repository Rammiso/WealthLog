const BaseRepository = require('./BaseRepository');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Goal Repository
 * Handles goal-specific database operations
 */
class GoalRepository extends BaseRepository {
  constructor(goalModel) {
    super(goalModel);
  }

  /**
   * Create goal with validation
   */
  async createGoal(userId, goalData) {
    try {
      const data = {
        ...goalData,
        userId
      };

      return await this.create(data);
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Invalid goal data', error.errors);
      }
      
      logger.error('Error creating goal:', error);
      throw ApiError.internal('Failed to create goal');
    }
  }

  /**
   * Update goal with validation
   */
  async updateGoal(userId, goalId, updateData) {
    try {
      return await this.updateById(goalId, updateData, userId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error updating goal:', error);
      throw ApiError.internal('Failed to update goal');
    }
  }

  /**
   * Find goals by user with options
   */
  async findByUser(userId, options = {}) {
    try {
      const {
        status,
        category,
        priority,
        page = 1,
        limit = 10,
        sort = { createdAt: -1 }
      } = options;

      const filter = { userId, deletedAt: null };
      
      if (status) filter.status = status;
      if (category) filter.category = category;
      if (priority) filter.priority = priority;

      const skip = (page - 1) * limit;
      const total = await this.model.countDocuments(filter);

      const goals = await this.model.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      return {
        data: goals,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error finding goals by user:', error);
      throw ApiError.internal('Failed to retrieve goals');
    }
  }

  /**
   * Find active goals by user
   */
  async findActiveByUser(userId) {
    try {
      return await this.model.findActiveByUser(userId);
    } catch (error) {
      logger.error('Error finding active goals:', error);
      throw ApiError.internal('Failed to retrieve active goals');
    }
  }

  /**
   * Find overdue goals by user
   */
  async findOverdueByUser(userId) {
    try {
      return await this.model.findOverdueByUser(userId);
    } catch (error) {
      logger.error('Error finding overdue goals:', error);
      throw ApiError.internal('Failed to retrieve overdue goals');
    }
  }

  /**
   * Update goal progress
   */
  async updateProgress(userId, goalId, currentAmount) {
    try {
      const goal = await this.findByIdAndUser(goalId, userId);
      
      if (!goal) {
        throw ApiError.notFound('Goal not found');
      }

      if (goal.status !== 'active') {
        throw ApiError.badRequest('Cannot update progress for inactive goal');
      }

      await goal.updateProgress(currentAmount);
      return goal;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error updating goal progress:', error);
      throw ApiError.internal('Failed to update goal progress');
    }
  }

  /**
   * Add to goal progress
   */
  async addToProgress(userId, goalId, amount) {
    try {
      const goal = await this.findByIdAndUser(goalId, userId);
      
      if (!goal) {
        throw ApiError.notFound('Goal not found');
      }

      if (goal.status !== 'active') {
        throw ApiError.badRequest('Cannot update progress for inactive goal');
      }

      await goal.addToProgress(amount);
      return goal;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error adding to goal progress:', error);
      throw ApiError.internal('Failed to add to goal progress');
    }
  }

  /**
   * Get goal summary for user
   */
  async getGoalSummary(userId) {
    try {
      const results = await this.model.getGoalSummary(userId);
      
      // Format results
      const summary = {
        total: 0,
        active: { count: 0, totalTarget: 0, totalCurrent: 0 },
        completed: { count: 0, totalTarget: 0, totalCurrent: 0 },
        paused: { count: 0, totalTarget: 0, totalCurrent: 0 },
        cancelled: { count: 0, totalTarget: 0, totalCurrent: 0 }
      };

      results.forEach(result => {
        summary.total += result.count;
        
        if (summary[result._id]) {
          summary[result._id] = {
            count: result.count,
            totalTarget: result.totalTarget,
            totalCurrent: result.totalCurrent
          };
        }
      });

      // Calculate overall progress
      const totalTarget = results.reduce((sum, r) => sum + r.totalTarget, 0);
      const totalCurrent = results.reduce((sum, r) => sum + r.totalCurrent, 0);
      
      summary.overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
      summary.overallProgressPercentage = Math.round(summary.overallProgress);

      return summary;
    } catch (error) {
      logger.error('Error getting goal summary:', error);
      throw ApiError.internal('Failed to get goal summary');
    }
  }

  /**
   * Find goals by category
   */
  async findByCategory(userId, category, options = {}) {
    try {
      const filter = { category };
      return await this.findByUser(userId, { ...options, category });
    } catch (error) {
      logger.error('Error finding goals by category:', error);
      throw ApiError.internal('Failed to retrieve goals by category');
    }
  }

  /**
   * Find goals by priority
   */
  async findByPriority(userId, priority, options = {}) {
    try {
      return await this.findByUser(userId, { ...options, priority });
    } catch (error) {
      logger.error('Error finding goals by priority:', error);
      throw ApiError.internal('Failed to retrieve goals by priority');
    }
  }

  /**
   * Search goals
   */
  async searchGoals(userId, searchTerm, options = {}) {
    try {
      const filter = {
        userId,
        deletedAt: null,
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 }
      } = options;

      const skip = (page - 1) * limit;
      const total = await this.model.countDocuments(filter);

      const goals = await this.model.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      return {
        data: goals,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error searching goals:', error);
      throw ApiError.internal('Failed to search goals');
    }
  }

  /**
   * Get goals by status
   */
  async findByStatus(userId, status, options = {}) {
    try {
      return await this.findByUser(userId, { ...options, status });
    } catch (error) {
      logger.error(`Error finding ${status} goals:`, error);
      throw ApiError.internal(`Failed to retrieve ${status} goals`);
    }
  }

  /**
   * Complete goal
   */
  async completeGoal(userId, goalId) {
    try {
      const goal = await this.findByIdAndUser(goalId, userId);
      
      if (!goal) {
        throw ApiError.notFound('Goal not found');
      }

      if (goal.status === 'completed') {
        throw ApiError.badRequest('Goal is already completed');
      }

      goal.status = 'completed';
      goal.currentAmount = goal.targetAmount;
      
      await goal.save();
      return goal;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error completing goal:', error);
      throw ApiError.internal('Failed to complete goal');
    }
  }

  /**
   * Pause goal
   */
  async pauseGoal(userId, goalId) {
    try {
      const goal = await this.findByIdAndUser(goalId, userId);
      
      if (!goal) {
        throw ApiError.notFound('Goal not found');
      }

      if (goal.status !== 'active') {
        throw ApiError.badRequest('Only active goals can be paused');
      }

      goal.status = 'paused';
      await goal.save();
      return goal;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error pausing goal:', error);
      throw ApiError.internal('Failed to pause goal');
    }
  }

  /**
   * Resume goal
   */
  async resumeGoal(userId, goalId) {
    try {
      const goal = await this.findByIdAndUser(goalId, userId);
      
      if (!goal) {
        throw ApiError.notFound('Goal not found');
      }

      if (goal.status !== 'paused') {
        throw ApiError.badRequest('Only paused goals can be resumed');
      }

      goal.status = 'active';
      await goal.save();
      return goal;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error resuming goal:', error);
      throw ApiError.internal('Failed to resume goal');
    }
  }
}

module.exports = GoalRepository;