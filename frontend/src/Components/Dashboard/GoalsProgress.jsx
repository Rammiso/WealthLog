import { memo } from "react";
import { Target, Calendar, TrendingUp } from "lucide-react";
import Card from "../ui/Card";

const GoalsProgress = memo(function GoalsProgress({ data }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "neon-green";
    if (percentage >= 50) return "neon-cyan";
    if (percentage >= 25) return "yellow-400";
    return "neon-magenta";
  };

  return (
    <Card className="p-6" hover={false}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-1">Financial Goals</h3>
            <p className="text-gray-400 text-sm">Track your savings progress</p>
          </div>
          <Target className="w-6 h-6 text-neon-cyan" />
        </div>

        <div className="space-y-6">
          {data.map((goal, index) => {
            const percentage = (goal.current / goal.target) * 100;
            const progressColor = getProgressColor(percentage);
            const daysRemaining = getDaysRemaining(goal.deadline);
            
            return (
              <div
                key={goal.id}
                className="space-y-3"
              >
                {/* Goal Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-100">{goal.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-400">
                        ETB {goal.current.toLocaleString()} / ETB {goal.target.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold text-${progressColor}`}>
                      {percentage.toFixed(0)}%
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>On track</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full bg-${progressColor} relative overflow-hidden transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Goal Details */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Started: {formatDate(goal.deadline).replace(/\d{4}/, '2024')}
                  </span>
                  <span className={`font-medium ${
                    daysRemaining < 30 ? 'text-yellow-400' : 
                    daysRemaining < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    Due: {formatDate(goal.deadline)}
                  </span>
                </div>

                {/* Separator */}
                {index < data.length - 1 && (
                  <div className="border-t border-gray-700/50 pt-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-neon-green">
                {data.filter(goal => (goal.current / goal.target) >= 0.8).length}
              </p>
              <p className="text-xs text-gray-400">Nearly Complete</p>
            </div>
            <div>
              <p className="text-lg font-bold text-neon-cyan">
                ETB {data.reduce((sum, goal) => sum + goal.current, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Total Saved</p>
            </div>
          </div>
        </div>
      </Card>
  );
});

export default GoalsProgress;