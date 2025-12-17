const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Get Expenses Pie Data Use Case
 * Handles expense aggregation by category for pie chart visualization
 */

class GetExpensesPieData {
  constructor(transactionRepository, categoryRepository) {
    this.transactionRepository = transactionRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, month, year) {
    try {
      const { startDate, endDate } = this.getMonthDateRange(month, year);

      // Get all expense transactions for the period
      const transactions = await this.transactionRepository.findByDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
        userId,
        { type: 'expense' }
      );

      // Get user categories for color/icon mapping
      const userCategories = await this.categoryRepository.findByUser(userId, { type: 'expense' });
      const categoryMap = this.createCategoryMap(userCategories.data);

      // Aggregate expenses by category
      const categoryTotals = this.aggregateByCategory(transactions.data);

      // Format data for pie chart
      const pieData = this.formatForPieChart(categoryTotals, categoryMap);

      // Calculate totals and percentages
      const totalExpenses = pieData.reduce((sum, item) => sum + item.value, 0);
      const formattedData = pieData.map(item => ({
        ...item,
        percentage: totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0
      }));

      const result = {
        period: {
          month,
          year,
          startDate,
          endDate,
          monthName: this.getMonthName(month)
        },
        data: formattedData,
        summary: {
          totalExpenses,
          totalCategories: formattedData.length,
          hasData: formattedData.length > 0
        }
      };

      logger.info('Expenses pie data generated successfully', {
        userId,
        month,
        year,
        totalExpenses,
        categoriesCount: formattedData.length
      });

      return result;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetExpensesPieData use case:', error);
      throw ApiError.internal('Failed to generate expenses pie data');
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

  // Create category mapping for colors and icons
  createCategoryMap(categories) {
    const map = new Map();
    
    categories.forEach(category => {
      map.set(category.name, {
        id: category.id,
        name: category.name,
        color: category.color || this.getDefaultColor(category.name),
        icon: category.icon || this.getDefaultIcon(category.name)
      });
    });

    return map;
  }

  // Aggregate transactions by category
  aggregateByCategory(transactions) {
    const categoryTotals = new Map();

    transactions.forEach(transaction => {
      const categoryName = transaction.categoryName;
      const currentTotal = categoryTotals.get(categoryName) || 0;
      categoryTotals.set(categoryName, currentTotal + transaction.amount);
    });

    return categoryTotals;
  }

  // Format data for pie chart consumption
  formatForPieChart(categoryTotals, categoryMap) {
    const data = [];

    categoryTotals.forEach((total, categoryName) => {
      const categoryInfo = categoryMap.get(categoryName) || {
        id: null,
        name: categoryName,
        color: this.getDefaultColor(categoryName),
        icon: this.getDefaultIcon(categoryName)
      };

      data.push({
        name: categoryName,
        value: total,
        color: categoryInfo.color,
        icon: categoryInfo.icon,
        categoryId: categoryInfo.id
      });
    });

    // Sort by value descending
    return data.sort((a, b) => b.value - a.value);
  }

  // Get default color for category
  getDefaultColor(categoryName) {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
      '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
    ];
    
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
      'food': '🍽️',
      'transport': '🚗',
      'entertainment': '🎬',
      'shopping': '🛍️',
      'utilities': '💡',
      'healthcare': '🏥',
      'education': '📚',
      'travel': '✈️',
      'rent': '🏠',
      'insurance': '🛡️'
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

module.exports = GetExpensesPieData;