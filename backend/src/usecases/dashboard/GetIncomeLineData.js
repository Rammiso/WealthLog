const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Get Income Line Data Use Case
 * Handles monthly income vs expenses aggregation for line chart visualization
 */

class GetIncomeLineData {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, months = 6) {
    try {
      // Validate months parameter
      if (months < 1 || months > 24) {
        throw ApiError.badRequest('Months must be between 1 and 24');
      }

      const { startDate, endDate, monthLabels } = this.getDateRange(months);

      // Get all transactions for the period
      const transactions = await this.transactionRepository.findByDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
        userId
      );

      // Aggregate data by month
      const monthlyData = this.aggregateByMonth(transactions.data, months);

      // Format data for line chart
      const lineData = this.formatForLineChart(monthlyData, monthLabels);

      // Calculate trends and insights
      const insights = this.calculateInsights(lineData);

      const result = {
        period: {
          months,
          startDate,
          endDate,
          labels: monthLabels
        },
        data: lineData,
        insights,
        summary: {
          totalIncome: lineData.reduce((sum, item) => sum + item.income, 0),
          totalExpenses: lineData.reduce((sum, item) => sum + item.expenses, 0),
          averageIncome: lineData.length > 0 ? lineData.reduce((sum, item) => sum + item.income, 0) / lineData.length : 0,
          averageExpenses: lineData.length > 0 ? lineData.reduce((sum, item) => sum + item.expenses, 0) / lineData.length : 0,
          hasData: lineData.some(item => item.income > 0 || item.expenses > 0)
        }
      };

      logger.info('Income line data generated successfully', {
        userId,
        months,
        totalIncome: result.summary.totalIncome,
        totalExpenses: result.summary.totalExpenses
      });

      return result;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetIncomeLineData use case:', error);
      throw ApiError.internal('Failed to generate income line data');
    }
  }

  // Get date range for the specified number of months
  getDateRange(months) {
    const endDate = new Date();
    endDate.setDate(1); // Start of current month
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Generate month labels
    const monthLabels = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < months; i++) {
      monthLabels.push({
        key: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`,
        label: this.getMonthYearLabel(current),
        month: current.getMonth() + 1,
        year: current.getFullYear()
      });
      current.setMonth(current.getMonth() + 1);
    }

    return { startDate, endDate, monthLabels };
  }

  // Aggregate transactions by month
  aggregateByMonth(transactions, months) {
    const monthlyData = new Map();

    // Initialize all months with zero values
    const current = new Date();
    current.setDate(1);
    
    for (let i = 0; i < months; i++) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(monthKey, {
        income: 0,
        expenses: 0,
        netIncome: 0,
        transactionCount: 0
      });
      current.setMonth(current.getMonth() - 1);
    }

    // Aggregate actual transaction data
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyData.has(monthKey)) {
        const monthData = monthlyData.get(monthKey);
        
        if (transaction.type === 'income') {
          monthData.income += transaction.amount;
        } else if (transaction.type === 'expense') {
          monthData.expenses += transaction.amount;
        }
        
        monthData.transactionCount++;
        monthData.netIncome = monthData.income - monthData.expenses;
      }
    });

    return monthlyData;
  }

  // Format data for line chart consumption
  formatForLineChart(monthlyData, monthLabels) {
    return monthLabels.map(monthInfo => {
      const data = monthlyData.get(monthInfo.key) || {
        income: 0,
        expenses: 0,
        netIncome: 0,
        transactionCount: 0
      };

      return {
        month: monthInfo.label,
        monthKey: monthInfo.key,
        income: data.income,
        expenses: data.expenses,
        netIncome: data.netIncome,
        transactionCount: data.transactionCount,
        savingsRate: data.income > 0 ? ((data.netIncome / data.income) * 100) : 0
      };
    });
  }

  // Calculate trends and insights
  calculateInsights(lineData) {
    if (lineData.length < 2) {
      return {
        incomeTrend: 'stable',
        expenseTrend: 'stable',
        netIncomeTrend: 'stable',
        bestMonth: null,
        worstMonth: null,
        averageSavingsRate: 0
      };
    }

    // Calculate trends
    const incomeTrend = this.calculateTrend(lineData.map(d => d.income));
    const expenseTrend = this.calculateTrend(lineData.map(d => d.expenses));
    const netIncomeTrend = this.calculateTrend(lineData.map(d => d.netIncome));

    // Find best and worst months
    const bestMonth = lineData.reduce((best, current) => 
      current.netIncome > best.netIncome ? current : best
    );
    
    const worstMonth = lineData.reduce((worst, current) => 
      current.netIncome < worst.netIncome ? current : worst
    );

    // Calculate average savings rate
    const validSavingsRates = lineData.filter(d => d.income > 0);
    const averageSavingsRate = validSavingsRates.length > 0 
      ? validSavingsRates.reduce((sum, d) => sum + d.savingsRate, 0) / validSavingsRates.length 
      : 0;

    return {
      incomeTrend,
      expenseTrend,
      netIncomeTrend,
      bestMonth: bestMonth.month,
      worstMonth: worstMonth.month,
      averageSavingsRate: Math.round(averageSavingsRate)
    };
  }

  // Calculate trend direction
  calculateTrend(values) {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const changePercent = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

    if (changePercent > 5) return 'increasing';
    if (changePercent < -5) return 'decreasing';
    return 'stable';
  }

  // Get month-year label
  getMonthYearLabel(date) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}

module.exports = GetIncomeLineData;