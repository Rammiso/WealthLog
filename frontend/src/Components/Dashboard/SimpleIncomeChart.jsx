import { memo } from "react";
import Card from "../ui/Card";

const SimpleIncomeChart = memo(function SimpleIncomeChart({ data }) {
  const maxValue = Math.max(...data.map(item => Math.max(item.income, item.expenses)));
  
  return (
    <Card className="p-6" hover={false}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-100 mb-1">Income vs Expenses</h3>
          <p className="text-gray-400 text-sm">Monthly comparison over the last 6 months</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-cyan"></div>
            <span className="text-sm text-gray-400">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-magenta"></div>
            <span className="text-sm text-gray-400">Expenses</span>
          </div>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.month} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{item.month}</span>
              <div className="flex gap-4">
                <span className="text-neon-cyan">ETB {item.income.toLocaleString()}</span>
                <span className="text-neon-magenta">ETB {item.expenses.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Income Bar */}
            <div className="relative">
              <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                <div 
                  className="bg-neon-cyan h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${(item.income / maxValue) * 100}%`,
                    transitionDelay: `${index * 100}ms`
                  }}
                />
              </div>
              
              {/* Expenses Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-neon-magenta h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${(item.expenses / maxValue) * 100}%`,
                    transitionDelay: `${index * 100 + 200}ms`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700/50">
        <div className="text-center">
          <p className="text-2xl font-bold text-neon-cyan">
            ETB {(data.reduce((sum, item) => sum + item.income, 0) / data.length / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-gray-400">Avg Income</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-neon-magenta">
            ETB {(data.reduce((sum, item) => sum + item.expenses, 0) / data.length / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-gray-400">Avg Expenses</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-neon-green">
            ETB {(data.reduce((sum, item) => sum + (item.income - item.expenses), 0) / data.length / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-gray-400">Avg Savings</p>
        </div>
      </div>
    </Card>
  );
});

export default SimpleIncomeChart;