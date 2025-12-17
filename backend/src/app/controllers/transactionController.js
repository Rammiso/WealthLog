const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');
const CreateTransaction = require('../../usecases/transaction/CreateTransaction');
const GetTransactions = require('../../usecases/transaction/GetTransactions');
const UpdateTransaction = require('../../usecases/transaction/UpdateTransaction');
const DeleteTransaction = require('../../usecases/transaction/DeleteTransaction');
const { getTransactionRepository, getCategoryRepository } = require('../../infrastructure/repositories/RepositoryFactory');

/**
 * Transaction Controller
 * Handles HTTP requests/responses for transactions
 * Delegates business logic to use cases
 */

class TransactionController {
  constructor() {
    this.transactionRepository = getTransactionRepository();
    this.categoryRepository = getCategoryRepository();
    this.createTransaction = new CreateTransaction(this.transactionRepository, this.categoryRepository);
    this.getTransactions = new GetTransactions(this.transactionRepository);
    this.updateTransaction = new UpdateTransaction(this.transactionRepository, this.categoryRepository);
    this.deleteTransaction = new DeleteTransaction(this.transactionRepository);
  }

  /**
   * Create new transaction
   * POST /api/v1/transactions
   */
  create = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { amount, description, notes, categoryId, date, type, currency } = req.body;

      // Validate required fields
      if (!amount || !description || !categoryId || !date || !type) {
        throw ApiError.badRequest('Amount, description, category, date, and type are required');
      }

      // Execute create transaction use case
      const result = await this.createTransaction.execute(userId, {
        amount,
        description,
        notes,
        categoryId,
        date,
        type,
        currency
      });

      // Log successful creation
      logger.info('Transaction creation successful', {
        transactionId: result.id,
        userId,
        type: result.type,
        amount: result.amount,
        ip: req.ip
      });

      // Send response
      ApiResponse.created(result, 'Transaction created successfully').send(res);

    } catch (error) {
      logger.warn('Transaction creation failed', {
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Get user transactions
   * GET /api/v1/transactions
   */
  getAll = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { 
        page, 
        limit, 
        type, 
        categoryId, 
        startDate, 
        endDate,
        sort 
      } = req.query;

      // Execute get transactions use case
      const result = await this.getTransactions.execute(userId, {
        page,
        limit,
        type,
        categoryId,
        startDate,
        endDate,
        sort: sort ? JSON.parse(sort) : undefined
      });

      // Send response
      ApiResponse.success(result, 'Transactions retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting transactions:', error);
      next(error);
    }
  };

  /**
   * Get transaction by ID
   * GET /api/v1/transactions/:id
   */
  getById = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute get transaction by ID use case
      const result = await this.getTransactions.getById(userId, id);

      // Send response
      ApiResponse.success(result, 'Transaction retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting transaction by ID:', error);
      next(error);
    }
  };

  /**
   * Update transaction
   * PUT /api/v1/transactions/:id
   */
  update = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { amount, description, notes, categoryId, date, type, currency } = req.body;

      // Execute update transaction use case
      const result = await this.updateTransaction.execute(userId, id, {
        amount,
        description,
        notes,
        categoryId,
        date,
        type,
        currency
      });

      logger.info('Transaction update successful', {
        transactionId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Transaction updated successfully').send(res);

    } catch (error) {
      logger.warn('Transaction update failed', {
        transactionId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Delete transaction
   * DELETE /api/v1/transactions/:id
   */
  delete = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute delete transaction use case
      const result = await this.deleteTransaction.execute(userId, id);

      logger.info('Transaction deletion successful', {
        transactionId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Transaction deleted successfully').send(res);

    } catch (error) {
      logger.warn('Transaction deletion failed', {
        transactionId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Get recent transactions
   * GET /api/v1/transactions/recent
   */
  getRecent = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { limit } = req.query;

      // Execute get recent transactions use case
      const result = await this.getTransactions.getRecent(userId, parseInt(limit) || 10);

      // Send response
      ApiResponse.success(result, 'Recent transactions retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting recent transactions:', error);
      next(error);
    }
  };

  /**
   * Search transactions
   * GET /api/v1/transactions/search
   */
  search = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { q: searchTerm, page, limit, type } = req.query;

      if (!searchTerm) {
        throw ApiError.badRequest('Search term (q) is required');
      }

      // Execute search use case
      const result = await this.getTransactions.search(userId, searchTerm, {
        page,
        limit,
        type
      });

      // Send response
      ApiResponse.success(result, 'Transaction search completed').send(res);

    } catch (error) {
      logger.error('Error searching transactions:', error);
      next(error);
    }
  };

  /**
   * Get transaction summary
   * GET /api/v1/transactions/summary
   */
  getSummary = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { period } = req.query;

      // Execute get summary use case
      const result = await this.getTransactions.getSummary(userId, period || 'month');

      // Send response
      ApiResponse.success(result, 'Transaction summary retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting transaction summary:', error);
      next(error);
    }
  };

  /**
   * Get spending by category
   * GET /api/v1/transactions/spending-by-category
   */
  getSpendingByCategory = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { period } = req.query;

      // Execute get spending by category use case
      const result = await this.getTransactions.getSpendingByCategory(userId, period || 'month');

      // Send response
      ApiResponse.success(result, 'Spending by category retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting spending by category:', error);
      next(error);
    }
  };

  /**
   * Bulk delete transactions
   * DELETE /api/v1/transactions/bulk
   */
  bulkDelete = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { transactionIds } = req.body;

      if (!transactionIds || !Array.isArray(transactionIds)) {
        throw ApiError.badRequest('Transaction IDs array is required');
      }

      // Execute bulk delete use case
      const result = await this.deleteTransaction.bulkDelete(userId, transactionIds);

      logger.info('Bulk transaction deletion completed', {
        userId,
        totalRequested: transactionIds.length,
        successful: result.summary.successful,
        failed: result.summary.failed,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Bulk transaction deletion completed').send(res);

    } catch (error) {
      logger.warn('Bulk transaction deletion failed', {
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };

  /**
   * Restore deleted transaction
   * PATCH /api/v1/transactions/:id/restore
   */
  restore = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Execute restore use case
      const result = await this.deleteTransaction.restore(userId, id);

      logger.info('Transaction restoration successful', {
        transactionId: id,
        userId,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Transaction restored successfully').send(res);

    } catch (error) {
      logger.warn('Transaction restoration failed', {
        transactionId: req.params?.id,
        userId: req.user?.id,
        error: error.message,
        ip: req.ip
      });

      next(error);
    }
  };
}

// Create singleton instance
const transactionController = new TransactionController();

module.exports = transactionController;