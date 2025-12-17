const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Delete Transaction Use Case
 * Handles transaction deletion business logic
 * Pure business logic, no dependencies on Express
 */

class DeleteTransaction {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, transactionId) {
    try {
      // Validate transaction ID format
      if (!transactionId || typeof transactionId !== 'string') {
        throw ApiError.badRequest('Valid transaction ID is required');
      }

      // Check if transaction exists and belongs to user
      const transaction = await this.transactionRepository.findById(transactionId, userId);

      // Soft delete transaction
      const deletedTransaction = await this.transactionRepository.deleteById(transactionId, userId);

      logger.info('Transaction deleted successfully', { 
        transactionId,
        userId,
        type: transaction.type,
        amount: transaction.amount
      });

      return {
        id: deletedTransaction.id,
        type: deletedTransaction.type,
        amount: deletedTransaction.amount,
        description: deletedTransaction.description,
        deletedAt: deletedTransaction.deletedAt
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in DeleteTransaction use case:', error);
      throw ApiError.internal('Transaction deletion failed');
    }
  }

  // Bulk delete transactions
  async bulkDelete(userId, transactionIds) {
    try {
      if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
        throw ApiError.badRequest('Transaction IDs array is required');
      }

      if (transactionIds.length > 100) {
        throw ApiError.badRequest('Cannot delete more than 100 transactions at once');
      }

      const results = [];
      const errors = [];

      for (const transactionId of transactionIds) {
        try {
          const result = await this.execute(userId, transactionId);
          results.push(result);
        } catch (error) {
          errors.push({
            transactionId,
            error: error.message
          });
        }
      }

      logger.info('Bulk transaction deletion completed', { 
        userId,
        totalRequested: transactionIds.length,
        successful: results.length,
        failed: errors.length
      });

      return {
        successful: results,
        failed: errors,
        summary: {
          totalRequested: transactionIds.length,
          successful: results.length,
          failed: errors.length
        }
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in DeleteTransaction bulkDelete:', error);
      throw ApiError.internal('Bulk transaction deletion failed');
    }
  }

  // Restore deleted transaction
  async restore(userId, transactionId) {
    try {
      // Validate transaction ID format
      if (!transactionId || typeof transactionId !== 'string') {
        throw ApiError.badRequest('Valid transaction ID is required');
      }

      // Restore transaction
      const restoredTransaction = await this.transactionRepository.restoreById(transactionId, userId);

      logger.info('Transaction restored successfully', { 
        transactionId,
        userId,
        type: restoredTransaction.type,
        amount: restoredTransaction.amount
      });

      return restoredTransaction.toTransactionJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in DeleteTransaction restore:', error);
      throw ApiError.internal('Transaction restoration failed');
    }
  }

  // Permanently delete transaction (use with caution)
  async permanentDelete(userId, transactionId) {
    try {
      // Validate transaction ID format
      if (!transactionId || typeof transactionId !== 'string') {
        throw ApiError.badRequest('Valid transaction ID is required');
      }

      // Check if transaction exists and belongs to user
      const transaction = await this.transactionRepository.findById(transactionId, userId);

      // Hard delete transaction
      const deletedTransaction = await this.transactionRepository.hardDeleteById(transactionId, userId);

      logger.warn('Transaction permanently deleted', { 
        transactionId,
        userId,
        type: transaction.type,
        amount: transaction.amount
      });

      return {
        id: deletedTransaction.id,
        type: deletedTransaction.type,
        amount: deletedTransaction.amount,
        description: deletedTransaction.description,
        permanentlyDeleted: true
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in DeleteTransaction permanentDelete:', error);
      throw ApiError.internal('Permanent transaction deletion failed');
    }
  }
}

module.exports = DeleteTransaction;