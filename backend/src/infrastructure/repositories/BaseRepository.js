const mongoose = require('mongoose');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Base Repository Class
 * Provides common CRUD operations for all repositories
 * Follows repository pattern to isolate database logic
 */
class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('Model is required for repository');
    }
    this.model = model;
    this.modelName = model.modelName;
  }

  /**
   * Create a new document
   */
  async create(data, userId = null) {
    try {
      const documentData = {
        ...data,
        ...(userId && { userId })
      };

      const document = new this.model(documentData);
      const savedDocument = await document.save();
      
      logger.info(`Created ${this.modelName}:`, { id: savedDocument.id });
      return savedDocument;
    } catch (error) {
      logger.error(`Error creating ${this.modelName}:`, error);
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation(`Invalid ${this.modelName} data`, error.errors);
      }
      
      if (error.code === 11000) {
        throw ApiError.conflict(`${this.modelName} already exists`);
      }
      
      throw ApiError.internal(`Failed to create ${this.modelName}`);
    }
  }

  /**
   * Find document by ID
   */
  async findById(id, userId = null) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid ID format');
      }

      const filter = { _id: id, deletedAt: null };
      if (userId) {
        filter.userId = userId;
      }

      const document = await this.model.findOne(filter);
      
      if (!document) {
        throw ApiError.notFound(`${this.modelName} not found`);
      }

      return document;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error finding ${this.modelName} by ID:`, error);
      throw ApiError.internal(`Failed to find ${this.modelName}`);
    }
  }

  /**
   * Find all documents with optional filtering
   */
  async findAll(filter = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        populate = null,
        userId = null
      } = options;

      // Build query filter
      const queryFilter = {
        ...filter,
        deletedAt: null,
        ...(userId && { userId })
      };

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build query
      let query = this.model.find(queryFilter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      // Add population if specified
      if (populate) {
        query = query.populate(populate);
      }

      // Execute query and count
      const [documents, total] = await Promise.all([
        query.exec(),
        this.model.countDocuments(queryFilter)
      ]);

      return {
        data: documents,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error(`Error finding ${this.modelName} documents:`, error);
      throw ApiError.internal(`Failed to retrieve ${this.modelName} list`);
    }
  }

  /**
   * Update document by ID
   */
  async updateById(id, updates, userId = null) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid ID format');
      }

      const filter = { _id: id, deletedAt: null };
      if (userId) {
        filter.userId = userId;
      }

      // Add metadata to updates
      const updateData = {
        ...updates,
        'metadata.source': 'api',
        updatedAt: new Date()
      };

      const document = await this.model.findOneAndUpdate(
        filter,
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!document) {
        throw ApiError.notFound(`${this.modelName} not found`);
      }

      logger.info(`Updated ${this.modelName}:`, { id: document.id });
      return document;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === 'ValidationError') {
        throw ApiError.validation(`Invalid ${this.modelName} update data`, error.errors);
      }

      logger.error(`Error updating ${this.modelName}:`, error);
      throw ApiError.internal(`Failed to update ${this.modelName}`);
    }
  }

  /**
   * Soft delete document by ID
   */
  async deleteById(id, userId = null) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid ID format');
      }

      const filter = { _id: id, deletedAt: null };
      if (userId) {
        filter.userId = userId;
      }

      const document = await this.model.findOneAndUpdate(
        filter,
        { 
          deletedAt: new Date(),
          'metadata.source': 'api'
        },
        { new: true }
      );

      if (!document) {
        throw ApiError.notFound(`${this.modelName} not found`);
      }

      logger.info(`Soft deleted ${this.modelName}:`, { id: document.id });
      return document;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(`Error deleting ${this.modelName}:`, error);
      throw ApiError.internal(`Failed to delete ${this.modelName}`);
    }
  }

  /**
   * Hard delete document by ID (use with caution)
   */
  async hardDeleteById(id, userId = null) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid ID format');
      }

      const filter = { _id: id };
      if (userId) {
        filter.userId = userId;
      }

      const document = await this.model.findOneAndDelete(filter);

      if (!document) {
        throw ApiError.notFound(`${this.modelName} not found`);
      }

      logger.warn(`Hard deleted ${this.modelName}:`, { id: document.id });
      return document;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(`Error hard deleting ${this.modelName}:`, error);
      throw ApiError.internal(`Failed to delete ${this.modelName}`);
    }
  }

  /**
   * Count documents with optional filter
   */
  async count(filter = {}, userId = null) {
    try {
      const queryFilter = {
        ...filter,
        deletedAt: null,
        ...(userId && { userId })
      };

      return await this.model.countDocuments(queryFilter);
    } catch (error) {
      logger.error(`Error counting ${this.modelName} documents:`, error);
      throw ApiError.internal(`Failed to count ${this.modelName} documents`);
    }
  }

  /**
   * Check if document exists
   */
  async exists(filter, userId = null) {
    try {
      const queryFilter = {
        ...filter,
        deletedAt: null,
        ...(userId && { userId })
      };

      const document = await this.model.findOne(queryFilter).select('_id');
      return !!document;
    } catch (error) {
      logger.error(`Error checking ${this.modelName} existence:`, error);
      throw ApiError.internal(`Failed to check ${this.modelName} existence`);
    }
  }

  /**
   * Restore soft deleted document
   */
  async restoreById(id, userId = null) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest('Invalid ID format');
      }

      const filter = { _id: id, deletedAt: { $ne: null } };
      if (userId) {
        filter.userId = userId;
      }

      const document = await this.model.findOneAndUpdate(
        filter,
        { 
          deletedAt: null,
          'metadata.source': 'api'
        },
        { new: true }
      );

      if (!document) {
        throw ApiError.notFound(`Deleted ${this.modelName} not found`);
      }

      logger.info(`Restored ${this.modelName}:`, { id: document.id });
      return document;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(`Error restoring ${this.modelName}:`, error);
      throw ApiError.internal(`Failed to restore ${this.modelName}`);
    }
  }

  /**
   * Bulk operations
   */
  async bulkCreate(dataArray, userId = null) {
    try {
      const documentsData = dataArray.map(data => ({
        ...data,
        ...(userId && { userId })
      }));

      const documents = await this.model.insertMany(documentsData, {
        ordered: false // Continue on error
      });

      logger.info(`Bulk created ${documents.length} ${this.modelName} documents`);
      return documents;
    } catch (error) {
      logger.error(`Error bulk creating ${this.modelName} documents:`, error);
      throw ApiError.internal(`Failed to bulk create ${this.modelName} documents`);
    }
  }

  /**
   * Get model statistics
   */
  async getStats(userId = null) {
    try {
      const filter = userId ? { userId } : {};
      
      const [total, active, deleted] = await Promise.all([
        this.model.countDocuments(filter),
        this.model.countDocuments({ ...filter, deletedAt: null }),
        this.model.countDocuments({ ...filter, deletedAt: { $ne: null } })
      ]);

      return {
        total,
        active,
        deleted,
        modelName: this.modelName
      };
    } catch (error) {
      logger.error(`Error getting ${this.modelName} stats:`, error);
      throw ApiError.internal(`Failed to get ${this.modelName} statistics`);
    }
  }
}

module.exports = BaseRepository;