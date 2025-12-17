/**
 * Category Domain Entity
 * Represents income and expense categories
 * Pure business logic, no dependencies on external frameworks
 */

class Category {
  constructor({
    id,
    userId,
    name,
    type, // 'income' or 'expense'
    color,
    icon,
    isDefault = false,
    isActive = true,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.type = type;
    this.color = color;
    this.icon = icon;
    this.isDefault = isDefault;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business logic methods
  isValidType() {
    return ['income', 'expense'].includes(this.type);
  }

  isValidColor() {
    // Validate hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return !this.color || hexColorRegex.test(this.color);
  }

  isValidIcon() {
    // Validate icon name (alphanumeric, hyphens, underscores)
    const iconRegex = /^[a-zA-Z0-9_-]+$/;
    return !this.icon || iconRegex.test(this.icon);
  }

  belongsToUser(userId) {
    return this.userId && this.userId.toString() === userId.toString();
  }

  canBeDeleted() {
    // Default categories cannot be deleted
    return !this.isDefault;
  }

  canBeModified() {
    // Default categories can be modified but not deleted
    return true;
  }

  getDisplayName() {
    return this.name || 'Unnamed Category';
  }

  // Validation methods
  validateForCreation() {
    const errors = [];

    if (!this.name || this.name.trim().length < 1) {
      errors.push('Category name is required');
    }

    if (this.name && this.name.length > 50) {
      errors.push('Category name cannot exceed 50 characters');
    }

    if (!this.isValidType()) {
      errors.push('Category type must be either income or expense');
    }

    if (!this.isValidColor()) {
      errors.push('Color must be a valid hex color (e.g., #FF5733)');
    }

    if (!this.isValidIcon()) {
      errors.push('Icon must contain only letters, numbers, hyphens, and underscores');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateForUpdate() {
    return this.validateForCreation();
  }

  // Convert to plain object (for API responses)
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      type: this.type,
      color: this.color,
      icon: this.icon,
      isDefault: this.isDefault,
      isActive: this.isActive,
      displayName: this.getDisplayName(),
      canBeDeleted: this.canBeDeleted(),
      canBeModified: this.canBeModified(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from database document
  static fromDocument(doc) {
    if (!doc) return null;
    
    return new Category({
      id: doc.id || doc._id,
      userId: doc.userId,
      name: doc.name,
      type: doc.type,
      color: doc.color,
      icon: doc.icon,
      isDefault: doc.isDefault,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  // Create for new category
  static forCreation({ userId, name, type, color, icon }) {
    return new Category({
      userId,
      name: name?.trim(),
      type,
      color: color?.trim(),
      icon: icon?.trim(),
      isDefault: false,
      isActive: true
    });
  }

  // Create default category
  static createDefault({ name, type, color, icon }) {
    return new Category({
      userId: null, // Default categories don't belong to specific users
      name,
      type,
      color,
      icon,
      isDefault: true,
      isActive: true
    });
  }

  // Get default categories
  static getDefaultCategories() {
    return {
      income: [
        { name: 'Salary', color: '#4CAF50', icon: 'briefcase' },
        { name: 'Freelance', color: '#2196F3', icon: 'laptop' },
        { name: 'Business', color: '#FF9800', icon: 'store' },
        { name: 'Investment', color: '#9C27B0', icon: 'trending-up' },
        { name: 'Other Income', color: '#607D8B', icon: 'plus-circle' }
      ],
      expense: [
        { name: 'Food & Dining', color: '#F44336', icon: 'utensils' },
        { name: 'Transportation', color: '#3F51B5', icon: 'car' },
        { name: 'Shopping', color: '#E91E63', icon: 'shopping-bag' },
        { name: 'Entertainment', color: '#FF5722', icon: 'film' },
        { name: 'Bills & Utilities', color: '#795548', icon: 'file-text' },
        { name: 'Healthcare', color: '#009688', icon: 'heart' },
        { name: 'Education', color: '#673AB7', icon: 'book' },
        { name: 'Travel', color: '#00BCD4', icon: 'map-pin' },
        { name: 'Other Expenses', color: '#9E9E9E', icon: 'minus-circle' }
      ]
    };
  }
}

module.exports = Category;