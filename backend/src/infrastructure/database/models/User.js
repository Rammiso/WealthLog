const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { createBaseSchema, validators } = require('../baseSchema');

/**
 * User Database Model
 * Mongoose schema for User entity with authentication fields
 */

const userSchemaDefinition = {
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },

  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    },
    index: true
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },

  currency: {
    type: String,
    required: true,
    enum: {
      values: ['ETB', 'USD', 'EUR', 'GBP'],
      message: 'Currency must be one of: ETB, USD, EUR, GBP'
    },
    default: 'ETB',
    uppercase: true
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  lastLoginAt: {
    type: Date,
    default: null
  },

  // Profile completion tracking
  profileComplete: {
    type: Boolean,
    default: false
  },

  // Authentication metadata
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },

  // Google OAuth fields (for future implementation)
  googleId: {
    type: String,
    sparse: true // Allows null values but ensures uniqueness when present
  }
};

// Create schema with base functionality
const userSchema = createBaseSchema(userSchemaDefinition);

// Indexes for performance
userSchema.index({ email: 1, deletedAt: 1 });
userSchema.index({ isActive: 1, deletedAt: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.virtual('displayName').get(function() {
  return this.fullName || this.email;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update profile completion
userSchema.pre('save', function(next) {
  // Check if profile is complete
  this.profileComplete = !!(
    this.firstName &&
    this.lastName &&
    this.email &&
    this.currency
  );
  
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

userSchema.methods.toAuthJSON = function() {
  return {
    id: this.id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    currency: this.currency,
    isActive: this.isActive,
    fullName: this.fullName,
    displayName: this.displayName,
    profileComplete: this.profileComplete,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt
  };
};

userSchema.methods.toPublicJSON = function() {
  return {
    id: this.id,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    displayName: this.displayName,
    currency: this.currency,
    profileComplete: this.profileComplete,
    createdAt: this.createdAt
  };
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ 
    email: email.toLowerCase(),
    deletedAt: null 
  });
};

userSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ 
    email: email.toLowerCase(),
    deletedAt: null,
    isActive: true
  }).select('+password');
};

userSchema.statics.emailExists = async function(email, excludeId = null) {
  const query = { 
    email: email.toLowerCase(),
    deletedAt: null 
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const user = await this.findOne(query).select('_id');
  return !!user;
};

// Create and export model
const User = mongoose.model('User', userSchema);

module.exports = User;