import { memo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import Card from "../ui/Card";

const IncomeExpenseChart = memo(function IncomeExpenseChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-secondary border border-neon-cyan/30 rounded-lg p-3 shadow-2xl">
          <p className="text-gray-300 text-sm mb-2">Month: {label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: ETB {entry.value?.toLocaleString() || 0}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff00ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.3}
              />
              
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="income"
                stroke="#00ffff"
                strokeWidth={3}
                fill="url(#incomeGradient)"
                dot={{ fill: "#00ffff", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#00ffff", strokeWidth: 2, fill: "#0a0a0a" }}
              />
              
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ff00ff"
                strokeWidth={3}
                fill="url(#expenseGradient)"
                dot={{ fill: "#ff00ff", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#ff00ff", strokeWidth: 2, fill: "#0a0a0a" }}
              />
            </AreaChart>
          </ResponsiveContainer>
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

export default IncomeExpenseChart;