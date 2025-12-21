const mongoose = require('mongoose');
const { createBaseSchema } = require('../baseSchema');

/**
 * Category Database Model
 * Mongoose schema for income and expense categories
 */

const categorySchemaDefinition = {
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [1, 'Category name is required'],
    maxlength: [50, 'Category name cannot exceed 50 characters'],
    index: true
  },

  type: {
    type: String,
    required: [true, 'Category type is required'],
    enum: {
      values: ['income', 'expense'],
      message: 'Category type must be either income or expense'
    },
    index: true
  },

  color: {
    type: String,
    trim: true,
    validate: {
      validator: function(color) {
        if (!color) return true; // Optional field
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
      },
      message: 'Color must be a valid hex color (e.g., #FF5733)'
    },
    default: '#607D8B'
  },

  icon: {
    type: String,
    trim: true,
    maxlength: [50, 'Icon cannot exceed 50 characters'],
    default: 'folder'
  },

  isDefault: {
    type: Boolean,
    default: false,
    index: true
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
};

// Create schema with base functionality
const categorySchema = createBaseSchema(categorySchemaDefinition);

// Additional indexes for performance
categorySchema.index({ userId: 1, type: 1, isActive: 1, deletedAt: 1 });
categorySchema.index({ type: 1, isDefault: 1 });
categorySchema.index({ name: 1, userId: 1, type: 1 }, { unique: true });

// Virtual for display name
categorySchema.virtual('displayName').get(function() {
  return this.name || 'Unnamed Category';
});

// Virtual for checking if can be deleted
categorySchema.virtual('canBeDeleted').get(function() {
  return !this.isDefault;
});

// Virtual for checking if can be modified
categorySchema.virtual('canBeModified').get(function() {
  return true; // All categories can be modified
});

// Instance methods
categorySchema.methods.belongsToUser = function(userId) {
  return this.userId && this.userId.toString() === userId.toString();
};

categorySchema.methods.toCategoryJSON = function() {
  return {
    id: this.id,
    name: this.name,
    type: this.type,
    color: this.color,
    icon: this.icon,
    isDefault: this.isDefault,
    isActive: this.isActive,
    displayName: this.displayName,
    canBeDeleted: this.canBeDeleted,
    canBeModified: this.canBeModified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
categorySchema.statics.findByUser = function(userId, type = null) {
  const filter = { 
    $or: [
      { userId, deletedAt: null },
      { isDefault: true, deletedAt: null }
    ],
    isActive: true
  };
  
  if (type) {
    filter.type = type;
  }

  return this.find(filter).sort({ isDefault: -1, name: 1 });
};

categorySchema.statics.findUserCategory = function(userId, categoryId) {
  return this.findOne({
    _id: categoryId,
    $or: [
      { userId, deletedAt: null },
      { isDefault: true, deletedAt: null }
    ],
    isActive: true
  });
};

categorySchema.statics.createDefaultCategories = async function(userId) {
  const defaultCategories = [
    // Income categories
    { name: 'Salary', type: 'income', color: '#4CAF50', icon: 'briefcase' },
    { name: 'Freelance', type: 'income', color: '#2196F3', icon: 'laptop' },
    { name: 'Business', type: 'income', color: '#FF9800', icon: 'store' },
    { name: 'Investment', type: 'income', color: '#9C27B0', icon: 'trending-up' },
    { name: 'Other Income', type: 'income', color: '#607D8B', icon: 'plus-circle' },
    
    // Expense categories
    { name: 'Food & Dining', type: 'expense', color: '#F44336', icon: 'utensils' },
    { name: 'Transportation', type: 'expense', color: '#3F51B5', icon: 'car' },
    { name: 'Shopping', type: 'expense', color: '#E91E63', icon: 'shopping-bag' },
    { name: 'Entertainment', type: 'expense', color: '#FF5722', icon: 'film' },
    { name: 'Bills & Utilities', type: 'expense', color: '#795548', icon: 'file-text' },
    { name: 'Healthcare', type: 'expense', color: '#009688', icon: 'heart' },
    { name: 'Education', type: 'expense', color: '#673AB7', icon: 'book' },
    { name: 'Travel', type: 'expense', color: '#00BCD4', icon: 'map-pin' },
    { name: 'Other Expenses', type: 'expense', color: '#9E9E9E', icon: 'minus-circle' }
  ];

  const userCategories = defaultCategories.map(cat => ({
    ...cat,
    userId,
    isDefault: false,
    isActive: true
  }));

  try {
    return await this.insertMany(userCategories, { ordered: false });
  } catch (error) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      // Some categories already exist, that's okay
      return [];
    }
    throw error;
  }
};

categorySchema.statics.getCategoryStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { userId: new mongoose.Types.ObjectId(userId), deletedAt: null },
          { isDefault: true, deletedAt: null }
        ],
        isActive: true
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        userCreated: {
          $sum: {
            $cond: [{ $eq: ['$isDefault', false] }, 1, 0]
          }
        },
        defaultCategories: {
          $sum: {
            $cond: [{ $eq: ['$isDefault', true] }, 1, 0]
          }
        }
      }
    }
  ]);
};

// Pre-save middleware to ensure name uniqueness per user and type
categorySchema.pre('save', async function(next) {
  if (this.isModified('name') || this.isModified('type')) {
    const existingCategory = await this.constructor.findOne({
      name: this.name,
      type: this.type,
      userId: this.userId,
      _id: { $ne: this._id },
      deletedAt: null
    });

    if (existingCategory) {
      const error = new Error(`Category '${this.name}' already exists for ${this.type}`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Create and export model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;