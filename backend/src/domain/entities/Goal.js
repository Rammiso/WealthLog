/**
 * Goal Domain Entity
 * Pure business logic for financial goals
 * Represents the core Goal business model
 */

class Goal {
  constructor({
    id,
    userId,
    title,
    description,
    targetAmount,
    currentAmount = 0,
    startDate,
    endDate,
    status = 'active',
    currency = 'ETB',
    category,
    priority = 'medium',
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.targetAmount = targetAmount;
    this.currentAmount = currentAmount;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.currency = currency;
    this.category = category;
    this.priority = priority;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business logic methods
  getProgress() {
    if (this.targetAmount <= 0) return 0;
    return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
  }

  getProgressPercentage() {
    return Math.round(this.getProgress());
  }

  getRemainingAmount() {
    return Math.max(this.targetAmount - this.currentAmount, 0);
  }

  isCompleted() {
    return this.currentAmount >= this.targetAmount || this.status === 'completed';
  }

  isActive() {
    return this.status === 'active';
  }

  isOverdue() {
    if (!this.endDate) return false;
    return new Date() > new Date(this.endDate) && !this.isCompleted();
  }

  getDaysRemaining() {
    if (!this.endDate) return null;
    const now = new Date();
    const end = new Date(this.endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  getDuration() {
    if (!this.startDate || !this.endDate) return null;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getRequiredMonthlyAmount() {
    const remaining = this.getRemainingAmount();
    const daysRemaining = this.getDaysRemaining();
    
    if (!daysRemaining || daysRemaining <= 0) return remaining;
    
    const monthsRemaining = daysRemaining / 30;
    return monthsRemaining > 0 ? remaining / monthsRemaining : remaining;
  }

  canUpdateAmount() {
    return this.isActive() && !this.isCompleted();
  }

  // Validation methods
  validateForCreation() {
    const errors = [];

    if (!this.title || this.title.trim().length < 2) {
      errors.push('Goal title must be at least 2 characters long');
    }

    if (this.title && this.title.length > 100) {
      errors.push('Goal title cannot exceed 100 characters');
    }

    if (!this.targetAmount || this.targetAmount <= 0) {
      errors.push('Target amount must be greater than 0');
    }

    if (this.targetAmount > 999999999.99) {
      errors.push('Target amount cannot exceed 999,999,999.99');
    }

    if (this.currentAmount < 0) {
      errors.push('Current amount cannot be negative');
    }

    if (this.currentAmount > this.targetAmount) {
      errors.push('Current amount cannot exceed target amount');
    }

    if (!this.startDate) {
      errors.push('Start date is required');
    }

    if (this.startDate && this.endDate && new Date(this.startDate) >= new Date(this.endDate)) {
      errors.push('End date must be after start date');
    }

    if (!['active', 'completed', 'paused', 'cancelled'].includes(this.status)) {
      errors.push('Status must be one of: active, completed, paused, cancelled');
    }

    if (!['ETB', 'USD', 'EUR', 'GBP'].includes(this.currency)) {
      errors.push('Currency must be one of: ETB, USD, EUR, GBP');
    }

    if (!['low', 'medium', 'high'].includes(this.priority)) {
      errors.push('Priority must be one of: low, medium, high');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to plain object (for API responses)
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      targetAmount: this.targetAmount,
      currentAmount: this.currentAmount,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
      currency: this.currency,
      category: this.category,
      priority: this.priority,
      progress: this.getProgress(),
      progressPercentage: this.getProgressPercentage(),
      remainingAmount: this.getRemainingAmount(),
      isCompleted: this.isCompleted(),
      isOverdue: this.isOverdue(),
      daysRemaining: this.getDaysRemaining(),
      duration: this.getDuration(),
      requiredMonthlyAmount: this.getRequiredMonthlyAmount(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from database document
  static fromDocument(doc) {
    if (!doc) return null;
    
    return new Goal({
      id: doc.id || doc._id,
      userId: doc.userId,
      title: doc.title,
      description: doc.description,
      targetAmount: doc.targetAmount,
      currentAmount: doc.currentAmount,
      startDate: doc.startDate,
      endDate: doc.endDate,
      status: doc.status,
      currency: doc.currency,
      category: doc.category,
      priority: doc.priority,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  // Create for creation
  static forCreation({ userId, title, description, targetAmount, currentAmount, startDate, endDate, currency, category, priority }) {
    return new Goal({
      userId,
      title: title?.trim(),
      description: description?.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      status: 'active',
      currency: currency?.toUpperCase() || 'ETB',
      category: category?.trim(),
      priority: priority?.toLowerCase() || 'medium'
    });
  }
}

module.exports = Goal;