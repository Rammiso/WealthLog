const Transaction = require('../../domain/entities/Transaction');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Create Transaction Use Case
 * Handles transaction creation business logic
 * Pure business logic, no dependencies on Express
 */

class CreateTransaction {
  constructor(transactionRepository, categoryRepository) {
    this.transactionRepository = transactionRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, transactionData) {
    try {
      const sanitizedData = this.validateInput(transactionData);

      // Validate category exists and belongs to user
      const category = await this.categoryRepository.findUserCategory(userId, sanitizedData.categoryId);

      // Ensure transaction type matches category type
      if (sanitizedData.type !== category.type) {
        throw ApiError.badRequest(`Transaction type must match category type (${category.type})`);
      }

      // Create transaction domain entity for validation
      const transactionEntity = Transaction.forCreation({
        userId,
        amount: sanitizedData.amount,
        description: sanitizedData.description,
        notes: sanitizedData.notes,
        categoryId: sanitizedData.categoryId,
        date: sanitizedData.date,
        type: sanitizedData.type,
        currency: sanitizedData.currency
      });

      // Validate transaction data
      const validation = transactionEntity.validateForCreation();
      if (!validation.isValid) {
        throw ApiError.validation('Transaction data is invalid', validation.errors);
      }

      // Prepare transaction data for database
      const data = {
        amount: transactionEntity.amount,
        description: transactionEntity.description,
        notes: transactionEntity.notes || '',
        categoryId: transactionEntity.categoryId,
        categoryName: category.name,
        date: transactionEntity.date,
        type: transactionEntity.type,
        currency: transactionEntity.currency
      };

      // Create transaction in database
      const createdTransaction = await this.transactionRepository.createTransaction(userId, data);

      logger.info('Transaction created successfully', { 
        transactionId: createdTransaction.id,
        userId,
        type: createdTransaction.type,
        amount: createdTransaction.amount,
        categoryName: createdTransaction.categoryName
      });

      return createdTransaction.toTransactionJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in CreateTransaction use case:', error);
      throw ApiError.internal('Transaction creation failed');
    }
  }

  // Validate input data structure
  validateInput(data) {
    const required = ['amount', 'description', 'categoryId', 'date', 'type'];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
      throw ApiError.badRequest(`Missing required fields: ${missing.join(', ')}`);
    }

    // Additional input sanitization
    const sanitized = {
      amount: parseFloat(data.amount),
      description: data.description?.toString().trim(),
      notes: data.notes?.toString().trim() || '',
      categoryId: data.categoryId?.toString().trim(),
      date: new Date(data.date),
      type: data.type?.toString().toLowerCase(),
      currency: data.currency?.toString().toUpperCase() || 'ETB'
    };

    // Validate amount
    if (isNaN(sanitized.amount) || sanitized.amount <= 0) {
      throw ApiError.badRequest('Amount must be a positive number');
    }

    if (sanitized.amount > 999999999.99) {
      throw ApiError.badRequest('Amount cannot exceed 999,999,999.99');
    }

    // Validate type
    if (!['income', 'expense'].includes(sanitized.type)) {
      throw ApiError.badRequest('Transaction type must be either income or expense');
    }

    // Validate currency
    if (!['ETB', 'USD', 'EUR', 'GBP'].includes(sanitized.currency)) {
      throw ApiError.badRequest('Currency must be one of: ETB, USD, EUR, GBP');
    }

    // Validate date
    if (isNaN(sanitized.date.getTime())) {
      throw ApiError.badRequest('Invalid date format');
    }

    return sanitized;
  }
}

module.exports = CreateTransaction;