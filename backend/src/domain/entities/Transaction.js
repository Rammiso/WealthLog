/**
 * Transaction Domain Entity
 * Base class for Income and Expense entities
 * Pure business logic, no dependencies on external frameworks
 */

class Transaction {
  constructor({
    id,
    userId,
    amount,
    description,
    notes,
    categoryId,
    categoryName,
    date,
    type, // 'income' or 'expense'
    currency = 'ETB',
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.description = description;
    this.notes = notes;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.date = date;
    this.type = type;
    this.currency = currency;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business logic methods
  isValidAmount() {
    return this.amount && this.amount > 0 && this.amount <= 999999999.99;
  }

  isValidCurrency() {
    const supportedCurrencies = ['ETB', 'USD', 'EUR', 'GBP'];
    return supportedCurrencies.includes(this.currency);
  }

  isValidType() {
    return ['income', 'expense'].includes(this.type);
  }

  isValidDate() {
    if (!this.date) return false;
    const transactionDate = new Date(this.date);
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    
    return transactionDate >= oneYearAgo && transactionDate <= oneYearFromNow;
  }

  belongsToUser(userId) {
    return this.userId && this.userId.toString() === userId.toString();
  }

  getFormattedAmount() {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }

  getDisplayDescription() {
    return this.description || 'No description';
  }

  // Validation methods
  validateForCreation() {
    const errors = [];

    if (!this.amount || !this.isValidAmount()) {
      errors.push('Amount must be a positive number up to 999,999,999.99');
    }

    if (!this.description || this.description.trim().length < 1) {
      errors.push('Description is required');
    }

    if (this.description && this.description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }

    if (!this.categoryId) {
      errors.push('Category is required');
    }

    if (!this.date || !this.isValidDate()) {
      errors.push('Valid date is required (within one year from today)');
    }

    if (!this.isValidType()) {
      errors.push('Transaction type must be either income or expense');
    }

    if (!this.isValidCurrency()) {
      errors.push('Currency must be one of: ETB, USD, EUR, GBP');
    }

    if (this.notes && this.notes.length > 1000) {
      errors.push('Notes cannot exceed 1000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateForUpdate() {
    // Same validation as creation, but userId is not required (already set)
    return this.validateForCreation();
  }

  // Convert to plain object (for API responses)
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.amount,
      description: this.description,
      notes: this.notes,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      date: this.date,
      type: this.type,
      currency: this.currency,
      formattedAmount: this.getFormattedAmount(),
      displayDescription: this.getDisplayDescription(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from database document
  static fromDocument(doc) {
    if (!doc) return null;
    
    return new Transaction({
      id: doc.id || doc._id,
      userId: doc.userId,
      amount: doc.amount,
      description: doc.description,
      notes: doc.notes,
      categoryId: doc.categoryId,
      categoryName: doc.categoryName,
      date: doc.date,
      type: doc.type,
      currency: doc.currency,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  // Create for new transaction
  static forCreation({ userId, amount, description, notes, categoryId, date, type, currency = 'ETB' }) {
    return new Transaction({
      userId,
      amount: parseFloat(amount),
      description: description?.trim(),
      notes: notes?.trim(),
      categoryId,
      date: new Date(date),
      type,
      currency: currency.toUpperCase()
    });
  }
}

module.exports = Transaction;