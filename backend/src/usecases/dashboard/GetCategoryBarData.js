const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Get Category Bar Data Use Case
 * Handles category breakdown for bar chart visualization (both income and expenses)
 */

class GetCategoryBarData {
  constructor(transactionRepository, categoryRepository) {
    this.transactionRepository = transactionRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, month, year, options = {}) {
    try {
      const { includeEmpty = false, type = 'both' } = options;
      const { startDate, endDate } = this.getMonthDateRange(month, year);

      // Get transactions for the period
      const transactions = await this.transactionRepository.findByDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
        userId
      );

      // Get user categories
      const userCategories = await this.categoryRepository.findByUser(userId);
      const categoryMap = this.createCategoryMap(userCategories.data);

      // Aggregate data by category and type
      const categoryData = this.aggregateByCategory(transactions.data, type);

      // Format data for bar chart
      const barData = this.formatForBarChart(categoryData, categoryMap, includeEmpty);

      // Calculate summary statistics
      const summary = this.calculateSummary(barData, type);

      const result = {
        period: {
          month,
          year,
          startDate,
          endDate,
          monthName: this.getMonthName(month)
        },
        data: barData,
        summary,
        options: {
          includeEmpty,
          type
        }
      };

      logger.info('Category bar data generated successfully', {
        userId,
        month,
        year,
        type,
        categoriesCount: barData.length
      });

      return result;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetCategoryBarData use case:', error);
      throw ApiError.internal('Failed to generate category bar data');
    }
  }

  // Get date range for the specified month and year
  getMonthDateRange(month, year) {
    const currentDate = new Date();
    const targetMonth = month || (currentDate.getMonth() + 1);
    const targetYear = year || currentDate.getFullYear();

    // Validate month and year
    if (targetMonth < 1 || targetMonth > 12) {
      throw ApiError.badRequest('Month must be between 1 and 12');
    }

    if (targetYear < 2000 || targetYear > 2100) {
      throw ApiError.badRequest('Year must be between 2000 and 2100');
    }

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    return { startDate, endDate };
  }

  // Create category mapping
  createCategoryMap(categories) {
    const map = new Map();
    
    categories.forEach(category => {
      map.set(`${category.name}-${category.type}`, {
        id: category.id,
        name: category.name,
        type: category.type,
        color: category.color || this.getDefaultColor(category.name, category.type),
        icon: category.icon || this.getDefaultIcon(category.name)
      });
    });

    return map;
  }

  // Aggregate transactions by category
  aggregateByCategory(transactions, type) {
    const categoryData = new Map();

    transactions.forEach(transaction => {
      // Filter by type if specified
      if (type !== 'both' && transaction.type !== type) {
        return;
      }

      const key = `${transaction.categoryName}-${transaction.type}`;
      
      if (!categoryData.has(key)) {
        categoryData.set(key, {
          categoryName: transaction.categoryName,
          type: transaction.type,
          total: 0,
          count: 0,
          transactions: []
        });
      }

      const data = categoryData.get(key);
      data.total += transaction.amount;
      data.count++;
      data.transactions.push(transaction);
    });

    return categoryData;
  }

  // Format data for bar chart consumption
  formatForBarChart(categoryData, categoryMap, includeEmpty) {
    const data = [];

    // Add categories with transactions
    categoryData.forEach((categoryInfo, key) => {
      const categoryMeta = categoryMap.get(key) || {
        id: null,
        name: categoryInfo.categoryName,
        type: categoryInfo.type,
        color: this.getDefaultColor(categoryInfo.categoryName, categoryInfo.type),
        icon: this.getDefaultIcon(categoryInfo.categoryName)
      };

      data.push({
        name: categoryInfo.categoryName,
        type: categoryInfo.type,
        value: categoryInfo.total,
        count: categoryInfo.count,
        color: categoryMeta.color,
        icon: categoryMeta.icon,
        categoryId: categoryMeta.id,
        averageAmount: categoryInfo.count > 0 ? categoryInfo.total / categoryInfo.count : 0
      });
    });

    // Add empty categories if requested
    if (includeEmpty) {
      categoryMap.forEach((categoryMeta, key) => {
        if (!categoryData.has(key)) {
          data.push({
            name: categoryMeta.name,
            type: categoryMeta.type,
            value: 0,
            count: 0,
            color: categoryMeta.color,
            icon: categoryMeta.icon,
            categoryId: categoryMeta.id,
            averageAmount: 0
          });
        }
      });
    }

    // Sort by value descending, then by name
    return data.sort((a, b) => {
      if (b.value !== a.value) {
        return b.value - a.value;
      }
      return a.name.localeCompare(b.name);
    });
  }

  // Calculate summary statistics
  calculateSummary(barData, type) {
    const incomeData = barData.filter(item => item.type === 'income');
    const expenseData = barData.filter(item => item.type === 'expense');

    const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);

    const summary = {
      totalCategories: barData.length,
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      hasData: barData.some(item => item.value > 0)
    };

    // Add type-specific summaries
    if (type === 'income' || type === 'both') {
      summary.income = {
        categories: incomeData.length,
        total: totalIncome,
        topCategory: incomeData.length > 0 ? incomeData[0] : null,
        averagePerCategory: incomeData.length > 0 ? totalIncome / incomeData.length : 0
      };
    }

    if (type === 'expense' || type === 'both') {
      summary.expenses = {
        categories: expenseData.length,
        total: totalExpenses,
        topCategory: expenseData.length > 0 ? expenseData[0] : null,
        averagePerCategory: expenseData.length > 0 ? totalExpenses / expenseData.length : 0
      };
    }

    return summary;
  }

  // Get default color for category
  getDefaultColor(categoryName, type) {
    const incomeColors = [
      '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'
    ];
    
    const expenseColors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
      '#2196F3', '#00BCD4', '#009688', '#795548', '#607D8B'
    ];

    const colors = type === 'income' ? incomeColors : expenseColors;
    
    // Simple hash function to assign consistent colors
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  // Get default icon for category
  getDefaultIcon(categoryName) {
    const iconMap = {
      'salary': '💰',
      'freelance': '💻',
      'business': '🏢',
      'investment': '📈',
      'food': '🍽️',
      'transport': '🚗',
      'entertainment': '🎬',
      'shopping': '🛍️',
      'utilities': '💡',
      'healthcare': '🏥',
      'education': '📚',
      'travel': '✈️',
      'rent': '🏠',
      'insurance': '🛡️',
      'groceries': '🛒',
      'gas': '⛽',
      'clothing': '👕',
      'fitness': '💪',
      'subscriptions': '📱'
    };

    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }

    return '📊'; // Default icon
  }

  // Get month name from number
  getMonthName(monthNumber) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months[monthNumber - 1] || 'Unknown';
  }
}

module.exports = GetCategoryBarData;