const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Get Transactions Use Case
 * Handles retrieving user transactions business logic
 * Pure business logic, no dependencies on Express
 */

class GetTransactions {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, options = {}) {
    try {
      const sanitizedOptions = this.validateOptions(options);

      // Get transactions with pagination
      const result = await this.transactionRepository.findByUser(userId, sanitizedOptions);

      // Format response
      const formattedTransactions = result.data.map(transaction => 
        transaction.toTransactionJSON ? transaction.toTransactionJSON() : transaction
      );

      logger.info('Transactions retrieved successfully', { 
        userId,
        count: formattedTransactions.length,
        page: sanitizedOptions.page,
        type: sanitizedOptions.type || 'all'
      });

      return {
        transactions: formattedTransactions,
        pagination: result.pagination
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetTransactions use case:', error);
      throw ApiError.internal('Failed to retrieve transactions');
    }
  }

  // Get single transaction by ID
  async getById(userId, transactionId) {
    try {
      if (!transactionId || typeof transactionId !== 'string') {
        throw ApiError.badRequest('Valid transaction ID is required');
      }

      const transaction = await this.transactionRepository.findById(transactionId, userId);

      logger.info('Transaction retrieved successfully', { 
        transactionId,
        userId
      });

      return transaction.toTransactionJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetTransactions getById:', error);
      throw ApiError.internal('Failed to retrieve transaction');
    }
  }

  // Get recent transactions
  async getRecent(userId, limit = 10) {
    try {
      const transactions = await this.transactionRepository.getRecentTransactions(userId, limit);

      const formattedTransactions = transactions.map(transaction => 
        transaction.toTransactionJSON ? transaction.toTransactionJSON() : transaction
      );

      logger.info('Recent transactions retrieved successfully', { 
        userId,
        count: formattedTransactions.length,
        limit
      });

      return formattedTransactions;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetTransactions getRecent:', error);
      throw ApiError.internal('Failed to retrieve recent transactions');
    }
  }

  // Search transactions
  async search(userId, searchTerm, options = {}) {
    try {
      if (!searchTerm || searchTerm.trim().length < 1) {
        throw ApiError.badRequest('Search term is required');
      }

      const sanitizedOptions = this.validateOptions(options);
      const result = await this.transactionRepository.searchTransactions(
        userId, 
        searchTerm.trim(), 
        sanitizedOptions
      );

      const formattedTransactions = result.data.map(transaction => 
        transaction.toTransactionJSON ? transaction.toTransactionJSON() : transaction
      );

      logger.info('Transaction search completed', { 
        userId,
        searchTerm,
        resultCount: formattedTransactions.length
      });

      return {
        transactions: formattedTransactions,
        pagination: result.pagination,
        searchTerm
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetTransactions search:', error);
      throw ApiError.internal('Failed to search transactions');
    }
  }

  // Get transaction summary
  async getSummary(userId, period = 'month') {
    try {
      if (!['week', 'month', 'year'].includes(period)) {
        throw ApiError.badRequest('Period must be one of: week, month, year');
      }

      const summary = await this.transactionRepository.getTransactionSummary(userId, period);

      logger.info('Transaction summary retrieved successfully', { 
        userId,
        period
      });

      return summary;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetTransactions getSummary:', error);
      throw ApiError.internal('Failed to retrieve transaction summary');
    }
  }

  // Get spending by category
  async getSpendingByCategory(userId, period = 'month') {
    try {
      if (!['week', 'month', 'year'].includes(period)) {
        throw ApiError.badRequest('Period must be one of: week, month, year');
      }

      const spending = await this.transactionRepository.getSpendingByCategory(userId, period);

      logger.info('Spending by category retrieved successfully', { 
        userId,
        period,
        categoryCount: spending.length
      });

      return spending;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetTransactions getSpendingByCategory:', error);
      throw ApiError.internal('Failed to retrieve spending by category');
    }
  }

  // Validate options
  validateOptions(options) {
    const sanitized = {
      page: parseInt(options.page) || 1,
      limit: parseInt(options.limit) || 10,
      sort: options.sort || { date: -1 }
    };

    // Validate pagination
    if (sanitized.page < 1) sanitized.page = 1;
    if (sanitized.limit < 1) sanitized.limit = 10;
    if (sanitized.limit > 100) sanitized.limit = 100;

    // Optional filters
    if (options.type) {
      if (!['income', 'expense'].includes(options.type)) {
        throw ApiError.badRequest('Type must be either income or expense');
      }
      sanitized.type = options.type;
    }

    if (options.categoryId) {
      sanitized.categoryId = options.categoryId;
    }

    if (options.startDate) {
      const startDate = new Date(options.startDate);
      if (isNaN(startDate.getTime())) {
        throw ApiError.badRequest('Invalid start date format');
      }
      sanitized.startDate = startDate;
    }

    if (options.endDate) {
      const endDate = new Date(options.endDate);
      if (isNaN(endDate.getTime())) {
        throw ApiError.badRequest('Invalid end date format');
      }
      sanitized.endDate = endDate;
    }

    return sanitized;
  }
}

module.exports = GetTransactions;