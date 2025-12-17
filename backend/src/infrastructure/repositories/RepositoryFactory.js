/**
 * Repository Factory
 * Provides centralized repository creation and dependency injection
 * Ensures consistent repository instantiation across the application
 */

const UserRepository = require('./UserRepository');
const TransactionRepository = require('./TransactionRepository');
const CategoryRepository = require('./CategoryRepository');
const { getModel, hasModel } = require('../database/models');

class RepositoryFactory {
  constructor() {
    this.repositories = new Map();
  }

  /**
   * Get or create repository instance
   */
  getRepository(repositoryName) {
    // Check if repository is already cached
    if (this.repositories.has(repositoryName)) {
      return this.repositories.get(repositoryName);
    }

    // Create new repository instance
    const repository = this.createRepository(repositoryName);
    
    // Cache the repository
    this.repositories.set(repositoryName, repository);
    
    return repository;
  }

  /**
   * Create repository instance based on name
   */
  createRepository(repositoryName) {
    switch (repositoryName.toLowerCase()) {
      case 'user':
        if (!hasModel('User')) {
          throw new Error('User model not available. Please implement User model first.');
        }
        return new UserRepository(getModel('User'));

      case 'transaction':
        if (!hasModel('Transaction')) {
          throw new Error('Transaction model not available. Please implement Transaction model first.');
        }
        return new TransactionRepository(getModel('Transaction'));

      case 'category':
        if (!hasModel('Category')) {
          throw new Error('Category model not available. Please implement Category model first.');
        }
        return new CategoryRepository(getModel('Category'));

      // Add more repositories as they are created
      // case 'goal':
      //   return new GoalRepository(getModel('Goal'));

      default:
        throw new Error(`Repository '${repositoryName}' not found`);
    }
  }

  /**
   * Get all available repository names
   */
  getAvailableRepositories() {
    return [
      'user',
      'transaction',
      'category'
      // Add more as they become available
    ];
  }

  /**
   * Check if repository is available
   */
  hasRepository(repositoryName) {
    try {
      this.getRepository(repositoryName);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear repository cache (useful for testing)
   */
  clearCache() {
    this.repositories.clear();
  }

  /**
   * Get repository statistics
   */
  getStats() {
    return {
      cachedRepositories: this.repositories.size,
      availableRepositories: this.getAvailableRepositories(),
      cacheKeys: Array.from(this.repositories.keys())
    };
  }
}

// Create singleton instance
const repositoryFactory = new RepositoryFactory();

// Convenience methods for common repositories
const getUserRepository = () => repositoryFactory.getRepository('user');
const getTransactionRepository = () => repositoryFactory.getRepository('transaction');
const getCategoryRepository = () => repositoryFactory.getRepository('category');

module.exports = {
  RepositoryFactory,
  repositoryFactory,
  getUserRepository,
  getTransactionRepository,
  getCategoryRepository
};