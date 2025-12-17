import { memo } from "react";
import Card from "../ui/Card";

const SimpleExpenseChart = memo(function SimpleExpenseChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="p-6" hover={false}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-1">Expense Distribution</h3>
        <p className="text-gray-400 text-sm">Breakdown by category this month</p>
      </div>

      {/* Simple Donut Chart using CSS */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
          
          {/* Expense segments */}
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const previousPercentages = data.slice(0, index).reduce((sum, prevItem) => sum + (prevItem.value / total) * 100, 0);
            
            return (
              <div
                key={item.name}
                className="absolute inset-0 rounded-full border-8 border-transparent transition-all duration-1000 ease-out"
                style={{
                  borderTopColor: percentage > 25 ? item.color : 'transparent',
                  borderRightColor: percentage > 25 && percentage <= 50 ? item.color : 'transparent',
                  borderBottomColor: percentage > 50 && percentage <= 75 ? item.color : 'transparent',
                  borderLeftColor: percentage > 75 ? item.color : 'transparent',
                  transform: `rotate(${previousPercentages * 3.6}deg)`,
                  transitionDelay: `${index * 200}ms`
                }}
              />
            );
          })}
          
          {/* Center content */}
          <div className="absolute inset-4 rounded-full bg-dark-secondary flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-100">ETB</p>
              <p className="text-lg font-semibold text-neon-cyan">{(total / 1000).toFixed(0)}k</p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate">{item.name}</p>
              <p className="text-xs text-gray-400">
                ETB {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-gray-700/50 text-center">
        <p className="text-2xl font-bold text-gray-100">ETB {total.toLocaleString()}</p>
        <p className="text-sm text-gray-400">Total Expenses</p>
      </div>
    </Card>
  );
});

export default SimpleExpenseChart;