const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Get Monthly Summary Use Case
 * Handles monthly financial summary business logic
 * Aggregates income, expenses, and goal progress for a specific month
 */

class GetMonthlySummary {
  constructor(transactionRepository, goalRepository) {
    this.transactionRepository = transactionRepository;
    this.goalRepository = goalRepository;
  }

  async execute(userId, month, year) {
    try {
      const { startDate, endDate } = this.getMonthDateRange(month, year);

      // Get transaction summary for the month
      const transactionSummary = await this.getTransactionSummary(userId, startDate, endDate);
      
      // Get category breakdown
      const categoryBreakdown = await this.getCategoryBreakdown(userId, startDate, endDate);
      
      // Get goal progress for the month
      const goalProgress = await this.getGoalProgress(userId, startDate, endDate);
      
      // Calculate insights
      const insights = this.calculateInsights(transactionSummary, categoryBreakdown, goalProgress);

      const summary = {
        period: {
          month,
          year,
          startDate,
          endDate,
          monthName: this.getMonthName(month)
        },
        transactions: transactionSummary,
        categories: categoryBreakdown,
        goals: goalProgress,
        insights
      };

      logger.info('Monthly summary generated successfully', {
        userId,
        month,
        year,
        totalIncome: transactionSummary.income.total,
        totalExpenses: transactionSummary.expenses.total
      });

      return summary;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetMonthlySummary use case:', error);
      throw ApiError.internal('Failed to generate monthly summary');
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

  // Get transaction summary for the period
  async getTransactionSummary(userId, startDate, endDate) {
    try {
      const transactions = await this.transactionRepository.findByDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
        userId
      );

      const summary = {
        income: { total: 0, count: 0, transactions: [] },
        expenses: { total: 0, count: 0, transactions: [] },
        netIncome: 0
      };

      transactions.data.forEach(transaction => {
        if (transaction.type === 'income') {
          summary.income.total += transaction.amount;
          summary.income.count++;
          summary.income.transactions.push(transaction);
        } else if (transaction.type === 'expense') {
          summary.expenses.total += transaction.amount;
          summary.expenses.count++;
          summary.expenses.transactions.push(transaction);
        }
      });

      summary.netIncome = summary.income.total - summary.expenses.total;
      summary.totalTransactions = summary.income.count + summary.expenses.count;

      return summary;
    } catch (error) {
      logger.error('Error getting transaction summary:', error);
      throw ApiError.internal('Failed to get transaction summary');
    }
  }

  // Get category breakdown for the period
  async getCategoryBreakdown(userId, startDate, endDate) {
    try {
      const transactions = await this.transactionRepository.findByDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
        userId
      );

      const categoryMap = new Map();

      transactions.data.forEach(transaction => {
        const key = `${transaction.categoryName}-${transaction.type}`;
        
        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            categoryName: transaction.categoryName,
            categoryId: transaction.categoryId,
            type: transaction.type,
            total: 0,
            count: 0,
            transactions: []
          });
        }

        const category = categoryMap.get(key);
        category.total += transaction.amount;
        category.count++;
        category.transactions.push(transaction);
      });

      const categories = Array.from(categoryMap.values());
      
      // Separate income and expense categories
      const incomeCategories = categories
        .filter(cat => cat.type === 'income')
        .sort((a, b) => b.total - a.total);
        
      const expenseCategories = categories
        .filter(cat => cat.type === 'expense')
        .sort((a, b) => b.total - a.total);

      return {
        income: incomeCategories,
        expenses: expenseCategories,
        totalCategories: categories.length
      };
    } catch (error) {
      logger.error('Error getting category breakdown:', error);
      throw ApiError.internal('Failed to get category breakdown');
    }
  }

  // Get goal progress for the period
  async getGoalProgress(userId, startDate, endDate) {
    try {
      // Get all active goals for the user
      const activeGoals = await this.goalRepository.findActiveByUser(userId);
      
      // Filter goals that were active during the specified period
      const relevantGoals = activeGoals.filter(goal => {
        const goalStart = new Date(goal.startDate);
        const goalEnd = goal.endDate ? new Date(goal.endDate) : new Date();
        
        // Goal overlaps with the specified period
        return goalStart <= endDate && goalEnd >= startDate;
      });

      const goalSummary = {
        totalGoals: relevantGoals.length,
        completedInPeriod: 0,
        totalProgress: 0,
        goals: []
      };

      relevantGoals.forEach(goal => {
        const goalData = {
          id: goal.id,
          title: goal.title,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          progress: goal.progress,
          progressPercentage: goal.progressPercentage,
          remainingAmount: goal.remainingAmount,
          isCompleted: goal.isCompleted,
          isOverdue: goal.isOverdue,
          daysRemaining: goal.daysRemaining,
          priority: goal.priority,
          category: goal.category
        };

        goalSummary.goals.push(goalData);
        goalSummary.totalProgress += goal.progress;

        // Check if goal was completed in this period
        if (goal.isCompleted && goal.updatedAt >= startDate && goal.updatedAt <= endDate) {
          goalSummary.completedInPeriod++;
        }
      });

      goalSummary.averageProgress = relevantGoals.length > 0 
        ? goalSummary.totalProgress / relevantGoals.length 
        : 0;

      return goalSummary;
    } catch (error) {
      logger.error('Error getting goal progress:', error);
      throw ApiError.internal('Failed to get goal progress');
    }
  }

  // Calculate insights and recommendations
  calculateInsights(transactionSummary, categoryBreakdown, goalProgress) {
    const insights = {
      savingsRate: 0,
      topExpenseCategory: null,
      topIncomeCategory: null,
      budgetStatus: 'neutral',
      goalAchievementRate: 0,
      recommendations: []
    };

    // Calculate savings rate
    if (transactionSummary.income.total > 0) {
      insights.savingsRate = (transactionSummary.netIncome / transactionSummary.income.total) * 100;
    }

    // Find top categories
    if (categoryBreakdown.expenses.length > 0) {
      insights.topExpenseCategory = categoryBreakdown.expenses[0];
    }

    if (categoryBreakdown.income.length > 0) {
      insights.topIncomeCategory = categoryBreakdown.income[0];
    }

    // Determine budget status
    if (transactionSummary.netIncome > 0) {
      insights.budgetStatus = 'surplus';
    } else if (transactionSummary.netIncome < 0) {
      insights.budgetStatus = 'deficit';
    }

    // Calculate goal achievement rate
    if (goalProgress.totalGoals > 0) {
      insights.goalAchievementRate = goalProgress.averageProgress;
    }

    // Generate recommendations
    insights.recommendations = this.generateRecommendations(
      transactionSummary,
      categoryBreakdown,
      goalProgress,
      insights
    );

    return insights;
  }

  // Generate personalized recommendations
  generateRecommendations(transactionSummary, categoryBreakdown, goalProgress, insights) {
    const recommendations = [];

    // Savings rate recommendations
    if (insights.savingsRate < 10) {
      recommendations.push({
        type: 'savings',
        priority: 'high',
        message: 'Consider increasing your savings rate. Aim for at least 10-20% of your income.',
        action: 'Review expenses and identify areas to cut back'
      });
    } else if (insights.savingsRate > 30) {
      recommendations.push({
        type: 'savings',
        priority: 'low',
        message: 'Excellent savings rate! You\'re building wealth effectively.',
        action: 'Consider investing excess savings for better returns'
      });
    }

    // Budget deficit recommendations
    if (insights.budgetStatus === 'deficit') {
      recommendations.push({
        type: 'budget',
        priority: 'high',
        message: 'You spent more than you earned this month. Review your expenses.',
        action: 'Create a budget and track spending more closely'
      });
    }

    // Top expense category recommendations
    if (insights.topExpenseCategory && transactionSummary.expenses.total > 0) {
      const categoryPercentage = (insights.topExpenseCategory.total / transactionSummary.expenses.total) * 100;
      
      if (categoryPercentage > 40) {
        recommendations.push({
          type: 'expense',
          priority: 'medium',
          message: `${insights.topExpenseCategory.categoryName} accounts for ${Math.round(categoryPercentage)}% of your expenses.`,
          action: `Review ${insights.topExpenseCategory.categoryName} spending for optimization opportunities`
        });
      }
    }

    // Goal progress recommendations
    if (goalProgress.totalGoals > 0 && insights.goalAchievementRate < 50) {
      recommendations.push({
        type: 'goals',
        priority: 'medium',
        message: 'Your goal progress is below 50%. Consider adjusting your targets or savings strategy.',
        action: 'Review goal timelines and increase monthly contributions'
      });
    }

    // No transaction recommendations
    if (transactionSummary.totalTransactions === 0) {
      recommendations.push({
        type: 'tracking',
        priority: 'high',
        message: 'No transactions recorded this month. Start tracking your finances.',
        action: 'Add your income and expenses to get better insights'
      });
    }

    return recommendations;
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

module.exports = GetMonthlySummary;