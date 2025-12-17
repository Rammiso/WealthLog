import { memo } from "react";
import Card from "../ui/Card";

const SimpleCategoryChart = memo(function SimpleCategoryChart({ data }) {
  const maxBudget = Math.max(...data.map(item => item.budget));
  
  return (
    <Card className="p-6" hover={false}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-1">Budget vs Spending</h3>
        <p className="text-gray-400 text-sm">Category-wise budget comparison</p>
      </div>

      {/* Simple Horizontal Bar Chart */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.amount / item.budget) * 100;
          let barColor = "bg-neon-green"; // Under budget
          if (percentage > 100) barColor = "bg-red-400"; // Over budget
          else if (percentage > 80) barColor = "bg-yellow-400"; // Near limit
          
          return (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">{item.category}</span>
                <div className="text-right">
                  <span className="text-sm text-gray-400">
                    ETB {item.amount.toLocaleString()} / ETB {item.budget.toLocaleString()}
                  </span>
                  <div className={`text-xs font-semibold ${
                    percentage > 100 ? 'text-red-400' : 
                    percentage > 80 ? 'text-yellow-400' : 'text-neon-green'
                  }`}>
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Budget bar (background) */}
              <div className="relative">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  {/* Budget indicator */}
                  <div 
                    className="absolute top-0 h-3 bg-gray-600 rounded-full opacity-50"
                    style={{ width: `${(item.budget / maxBudget) * 100}%` }}
                  />
                  
                  {/* Spending bar */}
                  <div 
                    className={`absolute top-0 h-3 rounded-full transition-all duration-1000 ease-out ${barColor}`}
                    style={{ 
                      width: `${Math.min((item.amount / maxBudget) * 100, 100)}%`,
                      transitionDelay: `${index * 150}ms`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-600 opacity-50"></div>
          <span className="text-sm text-gray-400">Budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-neon-green"></div>
          <span className="text-sm text-gray-400">Under Budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-400"></div>
          <span className="text-sm text-gray-400">Near Limit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-400"></div>
          <span className="text-sm text-gray-400">Over Budget</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-lg font-bold text-neon-green">
            {data.filter(item => item.amount <= item.budget * 0.8).length}
          </p>
          <p className="text-xs text-gray-400">Under Budget</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-400">
            {data.filter(item => item.amount > item.budget * 0.8 && item.amount <= item.budget).length}
          </p>
          <p className="text-xs text-gray-400">Near Limit</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">
            {data.filter(item => item.amount > item.budget).length}
          </p>
          <p className="text-xs text-gray-400">Over Budget</p>
        </div>
      </div>
    </Card>
  );
});

export default SimpleCategoryChart;