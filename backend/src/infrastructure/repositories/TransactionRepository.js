const BaseRepository = require('./BaseRepository');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');
const mongoose = require('mongoose');

/**
 * Transaction Repository
 * Handles transaction-specific database operations
 * Supports both income and expense transactions
 */
class TransactionRepository extends BaseRepository {
  constructor(transactionModel) {
    super(transactionModel);
  }

  /**
   * Create transaction with category validation
   */
  async createTransaction(userId, transactionData) {
    try {
      // Validate category exists and belongs to user
      const Category = require('../database/models/Category');
      const category = await Category.findUserCategory(userId, transactionData.categoryId);
      
      if (!category) {
        throw ApiError.badRequest('Invalid category selected');
      }

      // Ensure transaction type matches category type
      if (transactionData.type !== category.type) {
        throw ApiError.badRequest(`Transaction type must match category type (${category.type})`);
      }

      const data = {
        ...transactionData,
        userId,
        categoryName: category.name
      };

      return await this.create(data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Invalid transaction data', error.errors);
      }
      
      logger.error('Error creating transaction:', error);
      throw ApiError.internal('Failed to create transaction');
    }
  }

  /**
   * Update transaction with validation
   */
  async updateTransaction(userId, transactionId, updateData) {
    try {
      // If category is being updated, validate it
      if (updateData.categoryId) {
        const Category = require('../database/models/Category');
        const category = await Category.findUserCategory(userId, updateData.categoryId);
        
        if (!category) {
          throw ApiError.badRequest('Invalid category selected');
        }

        // If type is also being updated, ensure they match
        if (updateData.type && updateData.type !== category.type) {
          throw ApiError.badRequest(`Transaction type must match category type (${category.type})`);
        }

        updateData.categoryName = category.name;
      }

      return await this.updateById(transactionId, updateData, userId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Error updating transaction:', error);
      throw ApiError.internal('Failed to update transaction');
    }
  }

  /**
   * Find transactions by user with options
   */
  async findByUser(userId, options = {}) {
    try {
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
      const total = await this.model.countDocuments(filter);

      const transactions = await this.model.find(filter)
        .populate('categoryId', 'name color icon type')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      return {
        data: transactions,
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
      logger.error('Error finding transactions by user:', error);
      throw ApiError.internal('Failed to retrieve transactions');
    }
  }

  /**
   * Find transactions by type (income/expense)
   */
  async findByType(type, userId, options = {}) {
    try {
      const filter = { type };
      return await this.findAll(filter, { ...options, userId });
    } catch (error) {
      logger.error(`Error finding ${type} transactions:`, error);
      throw ApiError.internal(`Failed to retrieve ${type} transactions`);
    }
  }

  /**
   * Find transactions by category
   */
  async findByCategory(category, userId, options = {}) {
    try {
      const filter = { category };
      return await this.findAll(filter, { ...options, userId });
    } catch (error) {
      logger.error('Error finding transactions by category:', error);
      throw ApiError.internal('Failed to retrieve transactions by category');
    }
  }

  /**
   * Find transactions by date range
   */
  async findByDateRange(startDate, endDate, userId, options = {}) {
    try {
      const filter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      // Add type filter if specified
      if (options.type) {
        filter.type = options.type;
      }
      
      return await this.findAll(filter, { ...options, userId });
    } catch (error) {
      logger.error('Error finding transactions by date range:', error);
      throw ApiError.internal('Failed to retrieve transactions by date range');
    }
  }

  /**
   * Get transaction summary for user
   */
  async getTransactionSummary(userId, period = 'month') {
    try {
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

      const pipeline = [
        {
          $match: {
            userId: userId,
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
      ];

      const results = await this.model.aggregate(pipeline);
      
      // Format results
      const summary = {
        period,
        income: { total: 0, count: 0, avgAmount: 0 },
        expense: { total: 0, count: 0, avgAmount: 0 },
        netIncome: 0
      };

      results.forEach(result => {
        if (result._id === 'income') {
          summary.income = {
            total: result.total,
            count: result.count,
            avgAmount: result.avgAmount
          };
        } else if (result._id === 'expense') {
          summary.expense = {
            total: result.total,
            count: result.count,
            avgAmount: result.avgAmount
          };
        }
      });

      summary.netIncome = summary.income.total - summary.expense.total;
      
      return summary;
    } catch (error) {
      logger.error('Error getting transaction summary:', error);
      throw ApiError.internal('Failed to get transaction summary');
    }
  }

  /**
   * Get spending by category
   */
  async getSpendingByCategory(userId, period = 'month') {
    try {
      let dateFilter = {};
      const now = new Date();
      
      if (period === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = { date: { $gte: monthStart } };
      }

      const pipeline = [
        {
          $match: {
            userId: userId,
            type: 'expense',
            deletedAt: null,
            ...dateFilter
          }
        },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
            avgAmount: { $avg: '$amount' }
          }
        },
        {
          $sort: { total: -1 }
        }
      ];

      const results = await this.model.aggregate(pipeline);
      
      return results.map(result => ({
        category: result._id,
        total: result.total,
        count: result.count,
        avgAmount: result.avgAmount
      }));
    } catch (error) {
      logger.error('Error getting spending by category:', error);
      throw ApiError.internal('Failed to get spending by category');
    }
  }

  /**
   * Get monthly trends
   */
  async getMonthlyTrends(userId, months = 12) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const pipeline = [
        {
          $match: {
            userId: userId,
            deletedAt: null,
            date: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              type: '$type'
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ];

      const results = await this.model.aggregate(pipeline);
      
      // Format results by month
      const trends = {};
      results.forEach(result => {
        const monthKey = `${result._id.year}-${String(result._id.month).padStart(2, '0')}`;
        
        if (!trends[monthKey]) {
          trends[monthKey] = { income: 0, expense: 0, net: 0 };
        }
        
        trends[monthKey][result._id.type] = result.total;
      });

      // Calculate net income for each month
      Object.keys(trends).forEach(month => {
        trends[month].net = trends[month].income - trends[month].expense;
      });

      return trends;
    } catch (error) {
      logger.error('Error getting monthly trends:', error);
      throw ApiError.internal('Failed to get monthly trends');
    }
  }

  /**
   * Search transactions
   */
  async searchTransactions(userId, searchTerm, options = {}) {
    try {
      const filter = {
        $or: [
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
          { notes: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      return await this.findAll(filter, { ...options, userId });
    } catch (error) {
      logger.error('Error searching transactions:', error);
      throw ApiError.internal('Failed to search transactions');
    }
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(userId, limit = 10) {
    try {
      const options = {
        limit,
        sort: { date: -1, createdAt: -1 },
        userId
      };

      const result = await this.findAll({}, options);
      return result.data;
    } catch (error) {
      logger.error('Error getting recent transactions:', error);
      throw ApiError.internal('Failed to get recent transactions');
    }
  }

  /**
   * Bulk import transactions
   */
  async bulkImportTransactions(userId, transactionsData) {
    try {
      // Add userId to all transactions
      const transactionsWithUser = transactionsData.map(transaction => ({
        ...transaction,
        userId,
        metadata: {
          source: 'import',
          version: '1.0'
        }
      }));

      const result = await this.bulkCreate(transactionsWithUser);
      
      logger.info(`Bulk imported ${result.length} transactions for user ${userId}`);
      return result;
    } catch (error) {
      logger.error('Error bulk importing transactions:', error);
      throw ApiError.internal('Failed to import transactions');
    }
  }
}

module.exports = TransactionRepository;