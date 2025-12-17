const mongoose = require('mongoose');
const { createBaseSchema, validators } = require('../baseSchema');

/**
 * Goal Database Model
 * Mongoose schema for financial goals
 */

const goalSchemaDefinition = {
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    minlength: [2, 'Goal title must be at least 2 characters long'],
    maxlength: [100, 'Goal title cannot exceed 100 characters'],
    index: true
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },

  targetAmount: {
    ...validators.amount,
    required: [true, 'Target amount is required'],
    index: true
  },

  currentAmount: {
    type: Number,
    required: true,
    min: [0, 'Current amount cannot be negative'],
    max: [999999999.99, 'Current amount too large'],
    default: 0,
    validate: {
      validator: function(value) {
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      },
      message: 'Current amount must have at most 2 decimal places'
    }
  },

  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    index: true,
    default: Date.now
  },

  endDate: {
    type: Date,
    index: true,
    validate: {
      validator: function(date) {
        if (!date) return true; // Optional field
        return date > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },

  status: {
    type: String,
    required: [true, 'Goal status is required'],
    enum: {
      values: ['active', 'completed', 'paused', 'cancelled'],
      message: 'Status must be one of: active, completed, paused, cancelled'
    },
    default: 'active',
    index: true
  },

  currency: {
    ...validators.currency,
    index: true
  },

  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category name too long'],
    index: true
  },

  priority: {
    type: String,
    required: true,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be one of: low, medium, high'
    },
    default: 'medium',
    index: true
  }
};

// Create schema with base functionality
const goalSchema = createBaseSchema(goalSchemaDefinition);

// Additional indexes for performance
goalSchema.index({ userId: 1, status: 1, endDate: 1 });
goalSchema.index({ userId: 1, priority: 1, status: 1 });
goalSchema.index({ userId: 1, category: 1, status: 1 });
goalSchema.index({ endDate: 1, status: 1 }); // For overdue goals

// Virtual fields
goalSchema.virtual('progress').get(function() {
  if (this.targetAmount <= 0) return 0;
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

goalSchema.virtual('progressPercentage').get(function() {
  return Math.round(this.progress);
});

goalSchema.virtual('remainingAmount').get(function() {
  return Math.max(this.targetAmount - this.currentAmount, 0);
});

goalSchema.virtual('isCompleted').get(function() {
  return this.currentAmount >= this.targetAmount || this.status === 'completed';
});

goalSchema.virtual('isOverdue').get(function() {
  if (!this.endDate) return false;
  return new Date() > this.endDate && !this.isCompleted;
});

goalSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return null;
  const now = new Date();
  const diffTime = this.endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Pre-save middleware
goalSchema.pre('save', function(next) {
  // Auto-complete goal if current amount reaches target
  if (this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
  }
  
  // Validate current amount doesn't exceed target
  if (this.currentAmount > this.targetAmount) {
    return next(new Error('Current amount cannot exceed target amount'));
  }
  
  next();
});

// Instance methods
goalSchema.methods.belongsToUser = function(userId) {
  return this.userId && this.userId.toString() === userId.toString();
};

goalSchema.methods.updateProgress = function(amount) {
  if (amount < 0) {
    throw new Error('Amount cannot be negative');
  }
  
  this.currentAmount = Math.min(amount, this.targetAmount);
  
  if (this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
  }
  
  return this.save();
};

goalSchema.methods.addToProgress = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  const newAmount = this.currentAmount + amount;
  return this.updateProgress(newAmount);
};

goalSchema.methods.toGoalJSON = function() {
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
    progress: this.progress,
    progressPercentage: this.progressPercentage,
    remainingAmount: this.remainingAmount,
    isCompleted: this.isCompleted,
    isOverdue: this.isOverdue,
    daysRemaining: this.daysRemaining,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
goalSchema.statics.findByUser = function(userId, options = {}) {
  const {
    status,
    category,
    priority,
    page = 1,
    limit = 10,
    sort = { createdAt: -1 }
  } = options;

  const filter = { userId, deletedAt: null };
  
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;

  return this.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

goalSchema.statics.findActiveByUser = function(userId) {
  return this.find({ 
    userId, 
    status: 'active', 
    deletedAt: null 
  }).sort({ priority: -1, endDate: 1 });
};

goalSchema.statics.findOverdueByUser = function(userId) {
  const now = new Date();
  return this.find({
    userId,
    status: 'active',
    endDate: { $lt: now },
    deletedAt: null
  }).sort({ endDate: 1 });
};

goalSchema.statics.getGoalSummary = function(userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        deletedAt: null
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalTarget: { $sum: '$targetAmount' },
        totalCurrent: { $sum: '$currentAmount' }
      }
    }
  ]);
};

// Create and export model
const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;