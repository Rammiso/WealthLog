const mongoose = require('mongoose');

/**
 * Base schema configuration with common fields and methods
 * Provides consistent structure across all models
 */
const baseSchemaOptions = {
  timestamps: true, // Adds createdAt and updatedAt
  versionKey: false, // Removes __v field
  toJSON: {
    transform: function(doc, ret) {
      // Convert _id to id and remove _id
      ret.id = ret._id;
      delete ret._id;
      
      // Remove soft delete field from JSON output
      if (ret.deletedAt !== undefined && ret.deletedAt === null) {
        delete ret.deletedAt;
      }
      
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
};

/**
 * Add common fields to schema
 */
const addBaseFields = (schema) => {
  // Soft delete support
  schema.add({
    deletedAt: {
      type: Date,
      default: null,
      index: true
    }
  });

  // User ownership (will be populated when auth is implemented)
  schema.add({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Will be required when auth is implemented
      index: true
    }
  });

  // Metadata for tracking
  schema.add({
    metadata: {
      source: {
        type: String,
        enum: ['web', 'mobile', 'api', 'import'],
        default: 'web'
      },
      version: {
        type: String,
        default: '1.0'
      }
    }
  });
};

/**
 * Add common methods to schema
 */
const addBaseMethods = (schema) => {
  // Soft delete method
  schema.methods.softDelete = function() {
    this.deletedAt = new Date();
    return this.save();
  };

  // Restore soft deleted document
  schema.methods.restore = function() {
    this.deletedAt = null;
    return this.save();
  };

  // Check if document is soft deleted
  schema.methods.isDeleted = function() {
    return this.deletedAt !== null;
  };

  // Update with metadata
  schema.methods.updateWithMetadata = function(updates, source = 'api') {
    this.set(updates);
    this.metadata.source = source;
    this.metadata.version = '1.0';
    return this.save();
  };
};

/**
 * Add common static methods to schema
 */
const addBaseStatics = (schema) => {
  // Find non-deleted documents
  schema.statics.findActive = function(filter = {}) {
    return this.find({ ...filter, deletedAt: null });
  };

  // Find by ID (non-deleted)
  schema.statics.findActiveById = function(id) {
    return this.findOne({ _id: id, deletedAt: null });
  };

  // Find with user ownership
  schema.statics.findByUser = function(userId, filter = {}) {
    return this.find({ ...filter, userId, deletedAt: null });
  };

  // Count active documents
  schema.statics.countActive = function(filter = {}) {
    return this.countDocuments({ ...filter, deletedAt: null });
  };

  // Soft delete by ID
  schema.statics.softDeleteById = function(id) {
    return this.findByIdAndUpdate(id, { deletedAt: new Date() });
  };
};

/**
 * Add common indexes to schema
 */
const addBaseIndexes = (schema) => {
  // Compound index for user queries
  schema.index({ userId: 1, deletedAt: 1 });
  
  // Note: createdAt and updatedAt indexes are automatically created by timestamps: true
  // so we don't need to add them manually to avoid duplicate index warnings
};

/**
 * Create base schema with all common functionality
 */
const createBaseSchema = (definition, options = {}) => {
  const mergedOptions = { ...baseSchemaOptions, ...options };
  const schema = new mongoose.Schema(definition, mergedOptions);
  
  // Add base functionality
  addBaseFields(schema);
  addBaseMethods(schema);
  addBaseStatics(schema);
  addBaseIndexes(schema);
  
  return schema;
};

/**
 * Validation helpers for common field types
 */
const validators = {
  // Currency amount validation (supports ETB and other currencies)
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive'],
    max: [999999999.99, 'Amount too large'],
    validate: {
      validator: function(value) {
        // Check for valid decimal places (max 2)
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      },
      message: 'Amount must have at most 2 decimal places'
    }
  },

  // Currency code validation
  currency: {
    type: String,
    required: true,
    enum: ['ETB', 'USD', 'EUR', 'GBP'],
    default: 'ETB',
    uppercase: true
  },

  // Description validation
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, 'Description is required'],
    maxlength: [500, 'Description too long']
  },

  // Category validation
  category: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, 'Category is required'],
    maxlength: [50, 'Category name too long']
  }
};

module.exports = {
  createBaseSchema,
  baseSchemaOptions,
  validators,
  addBaseFields,
  addBaseMethods,
  addBaseStatics,
  addBaseIndexes
};