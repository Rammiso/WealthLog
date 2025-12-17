const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');
const GetExpensesPieData = require('../../usecases/dashboard/GetExpensesPieData');
const GetIncomeLineData = require('../../usecases/dashboard/GetIncomeLineData');
const GetCategoryBarData = require('../../usecases/dashboard/GetCategoryBarData');
const GetGoalsProgressData = require('../../usecases/dashboard/GetGoalsProgressData');
const { 
  getTransactionRepository, 
  getCategoryRepository, 
  getGoalRepository 
} = require('../../infrastructure/repositories/RepositoryFactory');

/**
 * Dashboard Controller
 * Handles HTTP requests/responses for dashboard analytics
 * Provides data for Recharts visualizations
 */

class DashboardController {
  constructor() {
    this.transactionRepository = getTransactionRepository();
    this.categoryRepository = getCategoryRepository();
    this.goalRepository = getGoalRepository();
    
    this.getExpensesPieData = new GetExpensesPieData(this.transactionRepository, this.categoryRepository);
    this.getIncomeLineData = new GetIncomeLineData(this.transactionRepository);
    this.getCategoryBarData = new GetCategoryBarData(this.transactionRepository, this.categoryRepository);
    this.getGoalsProgressData = new GetGoalsProgressData(this.goalRepository);
  }

  /**
   * Get expenses pie chart data
   * GET /api/v1/dashboard/expenses-pie
   */
  getExpensesPie = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { month, year } = req.query;

      // Execute get expenses pie data use case
      const result = await this.getExpensesPieData.execute(
        userId,
        month ? parseInt(month) : undefined,
        year ? parseInt(year) : undefined
      );

      // Log successful request
      logger.info('Expenses pie data retrieved successfully', {
        userId,
        month: result.period.month,
        year: result.period.year,
        categoriesCount: result.data.length,
        totalExpenses: result.summary.totalExpenses,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Expenses pie chart data retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting expenses pie data:', error);
      next(error);
    }
  };

  /**
   * Get income vs expenses line chart data
   * GET /api/v1/dashboard/income-line
   */
  getIncomeLine = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { months } = req.query;

      // Execute get income line data use case
      const result = await this.getIncomeLineData.execute(
        userId,
        months ? parseInt(months) : undefined
      );

      // Log successful request
      logger.info('Income line data retrieved successfully', {
        userId,
        months: result.period.months,
        totalIncome: result.summary.totalIncome,
        totalExpenses: result.summary.totalExpenses,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Income line chart data retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting income line data:', error);
      next(error);
    }
  };

  /**
   * Get category bar chart data
   * GET /api/v1/dashboard/category-bar
   */
  getCategoryBar = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { month, year, includeEmpty, type } = req.query;

      // Execute get category bar data use case
      const result = await this.getCategoryBarData.execute(
        userId,
        month ? parseInt(month) : undefined,
        year ? parseInt(year) : undefined,
        {
          includeEmpty: includeEmpty === 'true',
          type: type || 'both'
        }
      );

      // Log successful request
      logger.info('Category bar data retrieved successfully', {
        userId,
        month: result.period.month,
        year: result.period.year,
        type: result.options.type,
        categoriesCount: result.data.length,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Category bar chart data retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting category bar data:', error);
      next(error);
    }
  };

  /**
   * Get goals progress data
   * GET /api/v1/dashboard/goals-progress
   */
  getGoalsProgress = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { status, includeCompleted, limit } = req.query;

      // Execute get goals progress data use case
      const result = await this.getGoalsProgressData.execute(userId, {
        status: status || 'active',
        includeCompleted: includeCompleted === 'true',
        limit: limit ? parseInt(limit) : undefined
      });

      // Log successful request
      logger.info('Goals progress data retrieved successfully', {
        userId,
        status: result.options.status,
        goalsCount: result.data.length,
        overallProgress: result.summary.overallProgress,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(result, 'Goals progress data retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting goals progress data:', error);
      next(error);
    }
  };

  /**
   * Get comprehensive dashboard overview
   * GET /api/v1/dashboard/overview
   */
  getDashboardOverview = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { month, year, months = 6 } = req.query;

      // Execute multiple use cases in parallel for better performance
      const [expensesPie, incomeLine, categoryBar, goalsProgress] = await Promise.all([
        this.getExpensesPieData.execute(
          userId,
          month ? parseInt(month) : undefined,
          year ? parseInt(year) : undefined
        ),
        this.getIncomeLineData.execute(userId, parseInt(months)),
        this.getCategoryBarData.execute(
          userId,
          month ? parseInt(month) : undefined,
          year ? parseInt(year) : undefined,
          { type: 'both' }
        ),
        this.getGoalsProgressData.execute(userId, { 
          status: 'active',
          limit: 10 
        })
      ]);

      // Combine all data into comprehensive overview
      const overview = {
        period: {
          currentMonth: expensesPie.period.month,
          currentYear: expensesPie.period.year,
          monthsRange: incomeLine.period.months
        },
        expenses: {
          byCategory: expensesPie.data,
          total: expensesPie.summary.totalExpenses,
          categoriesCount: expensesPie.summary.totalCategories
        },
        income: {
          trend: incomeLine.data,
          insights: incomeLine.insights,
          summary: incomeLine.summary
        },
        categories: {
          breakdown: categoryBar.data,
          summary: categoryBar.summary
        },
        goals: {
          progress: goalsProgress.data,
          summary: goalsProgress.summary,
          insights: goalsProgress.insights
        },
        summary: {
          netIncome: incomeLine.summary.totalIncome - incomeLine.summary.totalExpenses,
          savingsRate: incomeLine.summary.totalIncome > 0 
            ? Math.round(((incomeLine.summary.totalIncome - incomeLine.summary.totalExpenses) / incomeLine.summary.totalIncome) * 100)
            : 0,
          activeGoals: goalsProgress.summary.activeGoals,
          overallGoalProgress: goalsProgress.summary.overallProgress,
          hasData: expensesPie.summary.hasData || incomeLine.summary.hasData || goalsProgress.summary.hasData
        }
      };

      // Log successful request
      logger.info('Dashboard overview retrieved successfully', {
        userId,
        netIncome: overview.summary.netIncome,
        savingsRate: overview.summary.savingsRate,
        activeGoals: overview.summary.activeGoals,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(overview, 'Dashboard overview retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting dashboard overview:', error);
      next(error);
    }
  };

  /**
   * Get dashboard statistics summary
   * GET /api/v1/dashboard/stats
   */
  getDashboardStats = async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Get current month data
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Execute use cases for current month
      const [expensesPie, categoryBar, goalsProgress] = await Promise.all([
        this.getExpensesPieData.execute(userId, currentMonth, currentYear),
        this.getCategoryBarData.execute(userId, currentMonth, currentYear, { type: 'both' }),
        this.getGoalsProgressData.execute(userId, { status: 'all' })
      ]);

      // Calculate key statistics
      const stats = {
        currentMonth: {
          totalIncome: categoryBar.summary.totalIncome || 0,
          totalExpenses: categoryBar.summary.totalExpenses || 0,
          netIncome: (categoryBar.summary.totalIncome || 0) - (categoryBar.summary.totalExpenses || 0),
          transactionCount: categoryBar.data.reduce((sum, cat) => sum + cat.count, 0),
          categoriesUsed: categoryBar.data.filter(cat => cat.value > 0).length
        },
        goals: {
          total: goalsProgress.summary.totalGoals,
          active: goalsProgress.summary.activeGoals,
          completed: goalsProgress.summary.completedGoals,
          overdue: goalsProgress.summary.overdueGoals,
          overallProgress: goalsProgress.summary.overallProgress,
          totalTargetAmount: goalsProgress.summary.totalTargetAmount,
          totalCurrentAmount: goalsProgress.summary.totalCurrentAmount
        },
        insights: {
          topExpenseCategory: expensesPie.data.length > 0 ? expensesPie.data[0] : null,
          savingsRate: categoryBar.summary.totalIncome > 0 
            ? Math.round(((categoryBar.summary.totalIncome - categoryBar.summary.totalExpenses) / categoryBar.summary.totalIncome) * 100)
            : 0,
          budgetStatus: (categoryBar.summary.totalIncome || 0) >= (categoryBar.summary.totalExpenses || 0) ? 'surplus' : 'deficit'
        }
      };

      // Log successful request
      logger.info('Dashboard stats retrieved successfully', {
        userId,
        totalIncome: stats.currentMonth.totalIncome,
        totalExpenses: stats.currentMonth.totalExpenses,
        activeGoals: stats.goals.active,
        ip: req.ip
      });

      // Send response
      ApiResponse.success(stats, 'Dashboard statistics retrieved successfully').send(res);

    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      next(error);
    }
  };
}

// Create singleton instance
const dashboardController = new DashboardController();

module.exports = dashboardController;