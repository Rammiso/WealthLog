const Transaction = require('../../domain/entities/Transaction');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Update Transaction Use Case
 * Handles transaction update business logic
 * Pure business logic, no dependencies on Express
 */

class UpdateTransaction {
  constructor(transactionRepository, categoryRepository) {
    this.transactionRepository = transactionRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, transactionId, updateData) {
    try {
      const sanitizedData = this.validateInput(updateData);

      // Check if transaction exists and belongs to user
      const existingTransaction = await this.transactionRepository.findById(transactionId, userId);

      // If category is being updated, validate it
      let category = null;
      if (sanitizedData.categoryId) {
        category = await this.categoryRepository.findUserCategory(userId, sanitizedData.categoryId);
        
        // If type is also being updated, ensure they match
        const newType = sanitizedData.type || existingTransaction.type;
        if (newType !== category.type) {
          throw ApiError.badRequest(`Transaction type must match category type (${category.type})`);
        }
      }

      // Create transaction entity for validation with merged data
      const transactionEntity = Transaction.forCreation({
        userId,
        amount: sanitizedData.amount !== undefined ? sanitizedData.amount : existingTransaction.amount,
        description: sanitizedData.description !== undefined ? sanitizedData.description : existingTransaction.description,
        notes: sanitizedData.notes !== undefined ? sanitizedData.notes : existingTransaction.notes,
        categoryId: sanitizedData.categoryId || existingTransaction.categoryId,
        date: sanitizedData.date !== undefined ? sanitizedData.date : existingTransaction.date,
        type: sanitizedData.type || existingTransaction.type,
        currency: sanitizedData.currency || existingTransaction.currency
      });

      // Validate updated transaction data
      const validation = transactionEntity.validateForUpdate();
      if (!validation.isValid) {
        throw ApiError.validation('Transaction update data is invalid', validation.errors);
      }

      // Prepare update data (only include provided fields)
      const updateFields = {};
      if (sanitizedData.amount !== undefined) updateFields.amount = sanitizedData.amount;
      if (sanitizedData.description !== undefined) updateFields.description = sanitizedData.description;
      if (sanitizedData.notes !== undefined) updateFields.notes = sanitizedData.notes;
      if (sanitizedData.date !== undefined) updateFields.date = sanitizedData.date;
      if (sanitizedData.currency !== undefined) updateFields.currency = sanitizedData.currency;
      
      // Add category info if category is being updated
      if (category) {
        updateFields.categoryId = category.id;
        updateFields.categoryName = category.name;
      }

      // Update transaction in database
      const updatedTransaction = await this.transactionRepository.updateTransaction(
        userId, 
        transactionId, 
        updateFields
      );

      logger.info('Transaction updated successfully', { 
        transactionId,
        userId,
        updatedFields: Object.keys(updateFields)
      });

      return updatedTransaction.toTransactionJSON();

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in UpdateTransaction use case:', error);
      throw ApiError.internal('Transaction update failed');
    }
  }

  // Validate input data structure
  validateInput(data) {
    const sanitized = {};

    if (data.amount !== undefined) {
      sanitized.amount = parseFloat(data.amount);
      if (isNaN(sanitized.amount) || sanitized.amount <= 0) {
        throw ApiError.badRequest('Amount must be a positive number');
      }
      if (sanitized.amount > 999999999.99) {
        throw ApiError.badRequest('Amount cannot exceed 999,999,999.99');
      }
    }

    if (data.description !== undefined) {
      sanitized.description = data.description?.toString().trim();
      if (sanitized.description.length < 1) {
        throw ApiError.badRequest('Description cannot be empty');
      }
      if (sanitized.description.length > 500) {
        throw ApiError.badRequest('Description cannot exceed 500 characters');
      }
    }

    if (data.notes !== undefined) {
      sanitized.notes = data.notes?.toString().trim() || '';
      if (sanitized.notes.length > 1000) {
        throw ApiError.badRequest('Notes cannot exceed 1000 characters');
      }
    }

    if (data.categoryId !== undefined) {
      sanitized.categoryId = data.categoryId?.toString().trim();
      if (!sanitized.categoryId) {
        throw ApiError.badRequest('Category ID cannot be empty');
      }
    }

    if (data.date !== undefined) {
      sanitized.date = new Date(data.date);
      if (isNaN(sanitized.date.getTime())) {
        throw ApiError.badRequest('Invalid date format');
      }
    }

    if (data.type !== undefined) {
      sanitized.type = data.type?.toString().toLowerCase();
      if (!['income', 'expense'].includes(sanitized.type)) {
        throw ApiError.badRequest('Transaction type must be either income or expense');
      }
    }

    if (data.currency !== undefined) {
      sanitized.currency = data.currency?.toString().toUpperCase();
      if (!['ETB', 'USD', 'EUR', 'GBP'].includes(sanitized.currency)) {
        throw ApiError.badRequest('Currency must be one of: ETB, USD, EUR, GBP');
      }
    }

    return sanitized;
  }
}

module.exports = UpdateTransaction;