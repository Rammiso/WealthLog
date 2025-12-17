const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Get Goals Progress Data Use Case
 * Handles goal progress data for dashboard visualization
 */

class GetGoalsProgressData {
  constructor(goalRepository) {
    this.goalRepository = goalRepository;
  }

  async execute(userId, options = {}) {
    try {
      const { status = 'active', includeCompleted = false, limit } = options;

      // Get goals based on status
      let goals;
      if (status === 'all') {
        goals = await this.goalRepository.findByUser(userId, { limit });
      } else if (includeCompleted) {
        goals = await this.goalRepository.findByUser(userId, { 
          status: { $in: ['active', 'completed'] },
          limit 
        });
      } else {
        goals = await this.goalRepository.findByUser(userId, { status, limit });
      }

      // Format goals for dashboard display
      const progressData = this.formatGoalsForDashboard(goals.data);

      // Calculate summary statistics
      const summary = this.calculateGoalsSummary(goals.data);

      // Get goal insights
      const insights = this.calculateGoalInsights(goals.data);

      const result = {
        data: progressData,
        summary,
        insights,
        options: {
          status,
          includeCompleted,
          limit
        }
      };

      logger.info('Goals progress data generated successfully', {
        userId,
        status,
        goalsCount: progressData.length
      });

      return result;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error in GetGoalsProgressData use case:', error);
      throw ApiError.internal('Failed to generate goals progress data');
    }
  }

  // Format goals for dashboard display
  formatGoalsForDashboard(goals) {
    return goals.map(goal => {
      const progressData = {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        progress: goal.progress,
        progressPercentage: goal.progressPercentage,
        remainingAmount: goal.remainingAmount,
        status: goal.status,
        priority: goal.priority,
        category: goal.category,
        currency: goal.currency,
        startDate: goal.startDate,
        endDate: goal.endDate,
        isCompleted: goal.isCompleted,
        isOverdue: goal.isOverdue,
        daysRemaining: goal.daysRemaining,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt
      };

      // Add visual properties for dashboard
      progressData.color = this.getProgressColor(goal.progress, goal.isOverdue);
      progressData.statusIcon = this.getStatusIcon(goal.status);
      progressData.priorityIcon = this.getPriorityIcon(goal.priority);
      progressData.progressText = this.getProgressText(goal);
      progressData.timelineText = this.getTimelineText(goal);

      return progressData;
    });
  }

  // Calculate goals summary statistics
  calculateGoalsSummary(goals) {
    const summary = {
      totalGoals: goals.length,
      activeGoals: 0,
      completedGoals: 0,
      pausedGoals: 0,
      overdueGoals: 0,
      totalTargetAmount: 0,
      totalCurrentAmount: 0,
      overallProgress: 0,
      averageProgress: 0,
      hasData: goals.length > 0
    };

    if (goals.length === 0) {
      return summary;
    }

    goals.forEach(goal => {
      // Count by status
      switch (goal.status) {
        case 'active':
          summary.activeGoals++;
          break;
        case 'completed':
          summary.completedGoals++;
          break;
        case 'paused':
          summary.pausedGoals++;
          break;
      }

      // Count overdue goals
      if (goal.isOverdue) {
        summary.overdueGoals++;
      }

      // Sum amounts
      summary.totalTargetAmount += goal.targetAmount;
      summary.totalCurrentAmount += goal.currentAmount;
    });

    // Calculate progress percentages
    summary.overallProgress = summary.totalTargetAmount > 0 
      ? (summary.totalCurrentAmount / summary.totalTargetAmount) * 100 
      : 0;

    summary.averageProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;

    // Round percentages
    summary.overallProgress = Math.round(summary.overallProgress);
    summary.averageProgress = Math.round(summary.averageProgress);

    return summary;
  }

  // Calculate goal insights and recommendations
  calculateGoalInsights(goals) {
    const insights = {
      topPerformingGoal: null,
      mostUrgentGoal: null,
      completionRate: 0,
      averageTimeToCompletion: null,
      recommendations: []
    };

    if (goals.length === 0) {
      return insights;
    }

    // Find top performing goal (highest progress)
    const activeGoals = goals.filter(goal => goal.status === 'active');
    if (activeGoals.length > 0) {
      insights.topPerformingGoal = activeGoals.reduce((top, current) => 
        current.progress > top.progress ? current : top
      );
    }

    // Find most urgent goal (closest deadline with lowest progress)
    const urgentGoals = activeGoals.filter(goal => goal.endDate && goal.daysRemaining > 0);
    if (urgentGoals.length > 0) {
      insights.mostUrgentGoal = urgentGoals.reduce((urgent, current) => {
        const urgentScore = urgent.daysRemaining / (urgent.progress + 1);
        const currentScore = current.daysRemaining / (current.progress + 1);
        return currentScore < urgentScore ? current : urgent;
      });
    }

    // Calculate completion rate
    const completedGoals = goals.filter(goal => goal.status === 'completed');
    insights.completionRate = goals.length > 0 
      ? Math.round((completedGoals.length / goals.length) * 100) 
      : 0;

    // Generate recommendations
    insights.recommendations = this.generateGoalRecommendations(goals, insights);

    return insights;
  }

  // Generate goal recommendations
  generateGoalRecommendations(goals, insights) {
    const recommendations = [];

    // No goals recommendation
    if (goals.length === 0) {
      recommendations.push({
        type: 'setup',
        priority: 'high',
        message: 'Start your financial journey by setting your first goal.',
        action: 'Create a new financial goal'
      });
      return recommendations;
    }

    // Low progress recommendation
    const lowProgressGoals = goals.filter(goal => 
      goal.status === 'active' && goal.progress < 25
    );
    
    if (lowProgressGoals.length > 0) {
      recommendations.push({
        type: 'progress',
        priority: 'medium',
        message: `${lowProgressGoals.length} goal(s) have less than 25% progress.`,
        action: 'Review and increase contributions to these goals'
      });
    }

    // Overdue goals recommendation
    const overdueGoals = goals.filter(goal => goal.isOverdue);
    if (overdueGoals.length > 0) {
      recommendations.push({
        type: 'deadline',
        priority: 'high',
        message: `${overdueGoals.length} goal(s) are overdue.`,
        action: 'Extend deadlines or increase contributions'
      });
    }

    // High completion rate praise
    if (insights.completionRate >= 80) {
      recommendations.push({
        type: 'achievement',
        priority: 'low',
        message: `Excellent! You've completed ${insights.completionRate}% of your goals.`,
        action: 'Consider setting more ambitious targets'
      });
    }

    // Too many active goals
    const activeGoals = goals.filter(goal => goal.status === 'active');
    if (activeGoals.length > 5) {
      recommendations.push({
        type: 'focus',
        priority: 'medium',
        message: `You have ${activeGoals.length} active goals. Consider focusing on fewer goals.`,
        action: 'Prioritize 3-5 most important goals'
      });
    }

    return recommendations;
  }

  // Get progress color based on percentage and status
  getProgressColor(progress, isOverdue) {
    if (isOverdue) return '#f44336'; // Red for overdue
    if (progress >= 100) return '#4caf50'; // Green for completed
    if (progress >= 75) return '#8bc34a'; // Light green for high progress
    if (progress >= 50) return '#ffc107'; // Yellow for medium progress
    if (progress >= 25) return '#ff9800'; // Orange for low progress
    return '#f44336'; // Red for very low progress
  }

  // Get status icon
  getStatusIcon(status) {
    const icons = {
      'active': '🎯',
      'completed': '✅',
      'paused': '⏸️',
      'cancelled': '❌'
    };
    return icons[status] || '📊';
  }

  // Get priority icon
  getPriorityIcon(priority) {
    const icons = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢'
    };
    return icons[priority] || '⚪';
  }

  // Get progress text
  getProgressText(goal) {
    if (goal.isCompleted) {
      return 'Completed!';
    }
    
    return `${goal.progressPercentage}% (${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()} ${goal.currency})`;
  }

  // Get timeline text
  getTimelineText(goal) {
    if (goal.isCompleted) {
      return 'Goal achieved';
    }
    
    if (goal.isOverdue) {
      return 'Overdue';
    }
    
    if (goal.daysRemaining === null) {
      return 'No deadline';
    }
    
    if (goal.daysRemaining === 0) {
      return 'Due today';
    }
    
    if (goal.daysRemaining === 1) {
      return '1 day remaining';
    }
    
    if (goal.daysRemaining <= 30) {
      return `${goal.daysRemaining} days remaining`;
    }
    
    const monthsRemaining = Math.ceil(goal.daysRemaining / 30);
    return `${monthsRemaining} month${monthsRemaining > 1 ? 's' : ''} remaining`;
  }
}

module.exports = GetGoalsProgressData;