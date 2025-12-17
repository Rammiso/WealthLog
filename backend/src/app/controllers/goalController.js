const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');
const CreateGoal = require('../../usecases/goal/CreateGoal');
const GetGoals = require('../../usecases/goal/GetGoals');
const UpdateGoal = require('../../usecases/goal/UpdateGoal');
const DeleteGoal = require('../../usecases/goal/DeleteGoal');
const GetMonthlySummary = require('../../usecases/summary/GetMonthlySummary');
const { getGoalRepository, getTransactionRepository } = require('../../infrastructure/repositories/RepositoryFactory');

/**
 * Goal Controller
 * Handles HTTP requests/responses for financial goals
 * Delegates business logic to use cases
 */

class GoalController {
  constructor() {
    this.goalRepository = getGoalRepository();
    this.transactionRepository = getTransactionRepository();
    this.createGoal = new CreateGoal(this.goalRepository);
    this.getGoals = new GetGoals(this.goalRepository);
    this.updateGoal = new UpdateGoal(this.goalRepository);
    this.deleteGoal = new DeleteGoal(this.goalRepository);
    this.getMonthlySummary = new GetMonthlySummary(this.transactionRepository, this.goalRepository);
  }

  /**
   * Create new goal
   * POST /api/v1/goals
   */
  create = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { 
        title, 
        description, 
        targetAmount, 
        currentAmount, 
        startDate, 
        endDate, 
        currency, 
        category, 
        priority 
      } = req.body;

      // Validate required fields
      if (!title || !targetAmount) {
        throw ApiError.badRequest('Title and target amount are required');
      }

      // Execute create goal use case
      const result = await this.createGoal.execute(userId, {
        title,
        description,
        targetAmount,
        currentAmount,
        startDate,
        endDate,
        currency,
        category,
        priority
      });

      // Log successful creation
      logger.info('Goal creation successful', {
        goalId: result.id,
        userId,
        title: result.title,
        targetAmount: result.targetAmount,
        ip: req.ip
      });

      // Send response
      ApiResponse.created(result, 'Goal created successfully').send(res);

    } catch (error) {
      logger.warn('Goal creation failed', {
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Get user goals
   * GET /api/v1/goals
   */
  getAll = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { 
        page, 
        limit, 
        status, 
        category, 
        priority,
        sort 
      } = req.query;

      // Execute get goals use case
      const result = await this.getGoals.execute(userId, {
        page,
        limit,
        status,
        category,
        priority,
        sort: sort ? JSON.parse(sort) : undefined
      });

      // Send response
      ApiResponse.success(result, 'Goals retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting goals:', error);
      next(error);
    }
  };

  /**
   * Get goal by ID
   * GET /api/v1/goals/:id
   */
  getById = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute get goal by ID use case
      const result = await this.getGoals.getById(userId, id);

      // Send response
      ApiResponse.success(result, 'Goal retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting goal by ID:', error);
      next(error);
    }
  };

  /**
   * Update goal
   * PUT /api/v1/goals/:id
   */
  update = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      // Execute update goal use case
      const result = await this.updateGoal.execute(userId, id, updateData);

      logger.info('Goal update successful', {
        goalId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Goal updated successfully').send(res);

    } catch (error) {
      logger.warn('Goal update failed', {
        goalId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Update goal progress
   * PATCH /api/v1/goals/:id/progress
   */
  updateProgress = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { currentAmount } = req.body;

      if (currentAmount === undefined) {
        throw ApiError.badRequest('Current amount is required');
      }

      // Execute update progress use case
      const result = await this.updateGoal.updateProgress(userId, id, currentAmount);

      logger.info('Goal progress update successful', {
        goalId: id,
        userId,
        currentAmount,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Goal progress updated successfully').send(res);

    } catch (error) {
      logger.warn('Goal progress update failed', {
        goalId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Add to goal progress
   * PATCH /api/v1/goals/:id/add-progress
   */
  addToProgress = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { amount } = req.body;

      if (!amount) {
        throw ApiError.badRequest('Amount is required');
      }

      // Execute add to progress use case
      const result = await this.updateGoal.addToProgress(userId, id, amount);

      logger.info('Amount added to goal progress successfully', {
        goalId: id,
        userId,
        amount,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Amount added to goal progress successfully').send(res);

    } catch (error) {
      logger.warn('Adding to goal progress failed', {
        goalId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Complete goal
   * PATCH /api/v1/goals/:id/complete
   */
  complete = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute complete goal use case
      const result = await this.updateGoal.completeGoal(userId, id);

      logger.info('Goal completion successful', {
        goalId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Goal completed successfully').send(res);

    } catch (error) {
      logger.warn('Goal completion failed', {
        goalId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Pause goal
   * PATCH /api/v1/goals/:id/pause
   */
  pause = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute pause goal use case
      const result = await this.updateGoal.pauseGoal(userId, id);

      logger.info('Goal pause successful', {
        goalId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Goal paused successfully').send(res);

    } catch (error) {
      logger.warn('Goal pause failed', {
        goalId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Resume goal
   * PATCH /api/v1/goals/:id/resume
   */
  resume = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute resume goal use case
      const result = await this.updateGoal.resumeGoal(userId, id);

      logger.info('Goal resume successful', {
        goalId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Goal resumed successfully').send(res);

    } catch (error) {
      logger.warn('Goal resume failed', {
        goalId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Delete goal
   * DELETE /api/v1/goals/:id
   */
  delete = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute delete goal use case
      const result = await this.deleteGoal.execute(userId, id);

      logger.info('Goal deletion successful', {
        goalId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Goal deleted successfully').send(res);

    } catch (error) {
      logger.warn('Goal deletion failed', {
        goalId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Get active goals
   * GET /api/v1/goals/active
   */
  getActive = async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Execute get active goals use case
      const result = await this.getGoals.getActive(userId);

      // Send response
      ApiResponse.success(result, 'Active goals retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting active goals:', error);
      next(error);
    }
  };

  /**
   * Get overdue goals
   * GET /api/v1/goals/overdue
   */
  getOverdue = async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Execute get overdue goals use case
      const result = await this.getGoals.getOverdue(userId);

      // Send response
      ApiResponse.success(result, 'Overdue goals retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting overdue goals:', error);
      next(error);
    }
  };

  /**
   * Get goal summary
   * GET /api/v1/goals/summary
   */
  getSummary = async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Execute get goal summary use case
      const result = await this.getGoals.getSummary(userId);

      // Send response
      ApiResponse.success(result, 'Goal summary retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting goal summary:', error);
      next(error);
    }
  };

  /**
   * Search goals
   * GET /api/v1/goals/search
   */
  search = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { q: searchTerm, page, limit, status, category, priority } = req.query;

      if (!searchTerm) {
        throw ApiError.badRequest('Search term (q) is required');
      }

      // Execute search use case
      const result = await this.getGoals.search(userId, searchTerm, {
        page,
        limit,
        status,
        category,
        priority
      });

      // Send response
      ApiResponse.success(result, 'Goal search completed').send(res);

    } catch (error) {
      logger.error('Error searching goals:', error);
      next(error);
    }
  };

  /**
   * Get monthly summary
   * GET /api/v1/summary/monthly
   */
  getMonthlySummaryReport = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { month, year } = req.query;

      // Execute get monthly summary use case
      const result = await this.getMonthlySummary.execute(
        userId, 
        month ? parseInt(month) : undefined, 
        year ? parseInt(year) : undefined
      );

      // Send response
      ApiResponse.success(result, 'Monthly summary retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting monthly summary:', error);
      next(error);
    }
  };

  /**
   * Bulk delete goals
   * DELETE /api/v1/goals/bulk
   */
  bulkDelete = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { goalIds } = req.body;

      if (!goalIds || !Array.isArray(goalIds)) {
        throw ApiError.badRequest('Goal IDs array is required');
      }

      // Execute bulk delete use case
      const result = await this.deleteGoal.bulkDelete(userId, goalIds);

      logger.info('Bulk goal deletion completed', {
        userId,
        totalRequested: goalIds.length,
        successful: result.summary.successful,
        failed: result.summary.failed,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Bulk goal deletion completed').send(res);

    } catch (error) {
      logger.warn('Bulk goal deletion failed', {
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Restore deleted goal
   * PATCH /api/v1/goals/:id/restore
   */
  restore = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute restore use case
      const result = await this.deleteGoal.restore(userId, id);

      logger.info('Goal restoration successful', {
        goalId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Goal restored successfully').send(res);

    } catch (error) {
      logger.warn('Goal restoration failed', {
        goalId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };
}

// Create singleton instance
const goalController = new GoalController();

module.exports = goalController;