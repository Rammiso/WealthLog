const mongoose = require('mongoose');
const { createBaseSchema, validators } = require('../baseSchema');

/**
 * Transaction Database Model
 * Mongoose schema for financial transactions (income and expenses)
 */

const transactionSchemaDefinition = {
  amount: {
    ...validators.amount,
    index: true
  },

  description: {
    ...validators.description,
    index: true
  },

  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: ''
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
    index: true
  },

  // Denormalized category name for faster queries
  categoryName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Category name too long']
  },

  date: {
    type: Date,
    required: [true, 'Transaction date is required'],
    index: true,
    validate: {
      validator: function(date) {
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        return date >= oneYearAgo && date <= oneYearFromNow;
      },
      message: 'Transaction date must be within one year from today'
    }
  },

  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['income', 'expense'],
      message: 'Transaction type must be either income or expense'
    },
    index: true
  },

  currency: {
    ...validators.currency,
    index: true
  }
};

// Create schema with base functionality
const transactionSchema = createBaseSchema(transactionSchemaDefinition);

// Additional indexes for performance
transactionSchema.index({ userId: 1, type: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1, date: -1 });
transactionSchema.index({ userId: 1, date: -1, deletedAt: 1 });
transactionSchema.index({ date: -1, type: 1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return `${this.amount.toFixed(2)} ${this.currency}`;
});

transactionSchema.virtual('displayDescription').get(function() {
  return this.description || 'No description';
});

// Pre-save middleware to set category name
transactionSchema.pre('save', async function(next) {
  if (this.isModified('categoryId') && this.categoryId) {
    try {
      const Category = mongoose.model('Category');
      const category = await Category.findById(this.categoryId);
      if (category) {
        this.categoryName = category.name;
      }
    } catch (error) {
      // If category lookup fails, validation will catch it
    }
  }
  next();
});

// Instance methods
transactionSchema.methods.belongsToUser = function(userId) {
  return this.userId && this.userId.toString() === userId.toString();
};

transactionSchema.methods.toTransactionJSON = function() {
  return {
    id: this.id,
    amount: this.amount,
    description: this.description,
    notes: this.notes,
    categoryId: this.categoryId,
    categoryName: this.categoryName,
    date: this.date,
    type: this.type,
    currency: this.currency,
    formattedAmount: this.formattedAmount,
    displayDescription: this.displayDescription,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
transactionSchema.statics.findByUser = function(userId, options = {}) {
  const {
    type,
    categoryId,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sort = { date: -1 }
  } = options;

  const filter = { userId, deletedAt: null };
  
  if (type) filter.type = type;
  if (categoryId) filter.categoryId = categoryId;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  return this.find(filter)
    .populate('categoryId', 'name color icon type')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

transactionSchema.statics.getTransactionSummary = function(userId, period = 'month') {
  let dateFilter = {};
  const now = new Date();
  
  switch (period) {
    case 'week':
      const weekStart = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { date: { $gte: weekStart } };
      break;
    case 'month':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { date: { $gte: monthStart } };
      break;
    case 'year':
      const yearStart = new Date(now.getFullYear(), 0, 1);
      dateFilter = { date: { $gte: yearStart } };
      break;
  }

  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        deletedAt: null,
        ...dateFilter
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    }
  ]);
};

transactionSchema.statics.getSpendingByCategory = function(userId, period = 'month') {
  let dateFilter = {};
  const now = new Date();
  
  if (period === 'month') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    dateFilter = { date: { $gte: monthStart } };
  }

  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: 'expense',
        deletedAt: null,
        ...dateFilter
      }
    },
    {
      $group: {
        _id: {
          categoryId: '$categoryId',
          categoryName: '$categoryName'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);
};

// Create and export model
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;