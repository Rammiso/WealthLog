import { memo } from "react";
import Card from "../ui/Card";

const SimpleCategoryChart = memo(function SimpleCategoryChart({ data }) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card className="p-6" hover={false}>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-1">Category Spending</h3>
          <p className="text-gray-400 text-sm">Spending breakdown by category</p>
        </div>

        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-600 rounded"></div>
          </div>
          <p className="text-gray-400 mb-4">No spending data available</p>
          <p className="text-sm text-gray-500">Add some transactions to see category breakdown</p>
        </div>
      </Card>
    );
  }

  const maxAmount = Math.max(...data.map(item => item.amount));
  
  return (
    <Card className="p-6" hover={false}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-1">Category Spending</h3>
        <p className="text-gray-400 text-sm">Spending breakdown by category</p>
      </div>

      {/* Simple Horizontal Bar Chart */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.amount / maxAmount) * 100;
          let barColor = "bg-neon-cyan"; // Default color
          if (item.type === 'expense') barColor = "bg-neon-magenta";
          if (item.type === 'income') barColor = "bg-neon-green";
          
          return (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">{item.category}</span>
                <div className="text-right">
                  <span className="text-sm text-gray-400">
                    ETB {item.amount.toLocaleString()}
                  </span>
                  <div className="text-xs font-semibold text-gray-500">
                    {percentage.toFixed(1)}% of total
                  </div>
                </div>
              </div>
              
              {/* Spending bar */}
              <div className="relative">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${barColor}`}
                    style={{ 
                      width: `${percentage}%`,
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
          <div className="w-3 h-3 rounded bg-neon-green"></div>
          <span className="text-sm text-gray-400">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-neon-magenta"></div>
          <span className="text-sm text-gray-400">Expenses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-neon-cyan"></div>
          <span className="text-sm text-gray-400">Other</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <p className="text-lg font-bold text-neon-green">
            {data.filter(item => item.type === 'income').length}
          </p>
          <p className="text-xs text-gray-400">Income Categories</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-neon-magenta">
            {data.filter(item => item.type === 'expense').length}
          </p>
          <p className="text-xs text-gray-400">Expense Categories</p>
        </div>
      </div>
    </Card>
  );
});

export default SimpleCategoryChart;