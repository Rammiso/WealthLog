const Goal = require('../../domain/entities/Goal');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Create Goal Use Case
 * Handles goal creation business logic
 * Pure business logic, no dependencies on Express
 */

class CreateGoal {
  constructor(goalRepository) {
    this.goalRepository = goalRepository;
  }

  async execute(userId, goalData) {
    try {
      const sanitizedData = this.validateInput(goalData);

      // Create goal domain entity for validation
      const goalEntity = Goal.forCreation({
        userId,
        title: sanitizedData.title,
        description: sanitizedData.description,
        targetAmount: sanitizedData.targetAmount,
        currentAmount: sanitizedData.currentAmount,
        startDate: sanitizedData.startDate,
        endDate: sanitizedData.endDate,
        currency: sanitizedData.currency,
        category: sanitizedData.category,
        priority: sanitizedData.priority
      });

      // Validate goal data
      const validation = goalEntity.validateForCreation();
      if (!validation.isValid) {
        throw ApiError.validation('Goal data is invalid', validation.errors);
      }

      // Prepare goal data for database
      const data = {
        title: goalEntity.title,
        description: goalEntity.description,
        targetAmount: goalEntity.targetAmount,
        currentAmount: goalEntity.currentAmount,
        startDate: goalEntity.startDate,
        endDate: goalEntity.endDate,
        currency: goalEntity.currency,
        category: goalEntity.category,
        priority: goalEntity.priority,
        status: 'active'
      };

      // Create goal in database
      const createdGoal = await this.goalRepository.createGoal(userId, data);

      logger.info('Goal created successfully', { 
        goalId: createdGoal.id,
        userId,
        title: createdGoal.title,
        targetAmount: createdGoal.targetAmount,
        priority: createdGoal.priority
      });

      return createdGoal.toGoalJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in CreateGoal use case:', error);
      throw ApiError.internal('Goal creation failed');
    }
  }

  // Validate input data structure
  validateInput(data) {
    const required = ['title', 'targetAmount'];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
      throw ApiError.badRequest(`Missing required fields: ${missing.join(', ')}`);
    }

    // Additional input sanitization
    const sanitized = {
      title: data.title?.toString().trim(),
      description: data.description?.toString().trim() || '',
      targetAmount: parseFloat(data.targetAmount),
      currentAmount: parseFloat(data.currentAmount) || 0,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      endDate: data.endDate ? new Date(data.endDate) : null,
      currency: data.currency?.toString().toUpperCase() || 'ETB',
      category: data.category?.toString().trim() || '',
      priority: data.priority?.toString().toLowerCase() || 'medium'
    };

    // Validate target amount
    if (isNaN(sanitized.targetAmount) || sanitized.targetAmount <= 0) {
      throw ApiError.badRequest('Target amount must be a positive number');
    }

    if (sanitized.targetAmount > 999999999.99) {
      throw ApiError.badRequest('Target amount cannot exceed 999,999,999.99');
    }

    // Validate current amount
    if (isNaN(sanitized.currentAmount) || sanitized.currentAmount < 0) {
      throw ApiError.badRequest('Current amount must be a non-negative number');
    }

    if (sanitized.currentAmount > sanitized.targetAmount) {
      throw ApiError.badRequest('Current amount cannot exceed target amount');
    }

    // Validate currency
    if (!['ETB', 'USD', 'EUR', 'GBP'].includes(sanitized.currency)) {
      throw ApiError.badRequest('Currency must be one of: ETB, USD, EUR, GBP');
    }

    // Validate priority
    if (!['low', 'medium', 'high'].includes(sanitized.priority)) {
      throw ApiError.badRequest('Priority must be one of: low, medium, high');
    }

    // Validate dates
    if (sanitized.startDate && isNaN(sanitized.startDate.getTime())) {
      throw ApiError.badRequest('Invalid start date format');
    }

    if (sanitized.endDate && isNaN(sanitized.endDate.getTime())) {
      throw ApiError.badRequest('Invalid end date format');
    }

    if (sanitized.startDate && sanitized.endDate && sanitized.startDate >= sanitized.endDate) {
      throw ApiError.badRequest('End date must be after start date');
    }

    return sanitized;
  }
}

module.exports = CreateGoal;