/**
 * User Domain Entity
 * Pure business logic, no dependencies on external frameworks
 * Represents the core User business model
 */

class User {
  constructor({
    id,
    firstName,
    lastName,
    email,
    currency = 'ETB',
    isActive = true,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.currency = currency;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business logic methods
  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  getDisplayName() {
    return this.getFullName() || this.email;
  }

  isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  isSupportedCurrency() {
    const supportedCurrencies = ['ETB', 'USD', 'EUR', 'GBP'];
    return supportedCurrencies.includes(this.currency);
  }

  canPerformActions() {
    return this.isActive;
  }

  // Validation methods
  validateForRegistration() {
    const errors = [];

    if (!this.firstName || this.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (!this.lastName || this.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    if (!this.email || !this.isValidEmail()) {
      errors.push('Valid email address is required');
    }

    if (!this.isSupportedCurrency()) {
      errors.push('Currency must be one of: ETB, USD, EUR, GBP');
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
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      currency: this.currency,
      isActive: this.isActive,
      fullName: this.getFullName(),
      displayName: this.getDisplayName(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from database document
  static fromDocument(doc) {
    if (!doc) return null;
    
    return new User({
      id: doc.id || doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      currency: doc.currency,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  // Create for registration
  static forRegistration({ firstName, lastName, email, currency = 'ETB' }) {
    return new User({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.toLowerCase().trim(),
      currency: currency.toUpperCase(),
      isActive: true
    });
  }
}

module.exports = User;