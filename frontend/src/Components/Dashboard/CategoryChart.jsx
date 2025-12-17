import { memo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../ui/Card";

const CategoryChart = memo(function CategoryChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const spent = payload[0].value;
      const budget = payload[1].value;
      const percentage = ((spent / budget) * 100).toFixed(1);
      
      return (
        <div className="bg-dark-secondary border border-neon-cyan/30 rounded-lg p-3 shadow-2xl">
          <p className="text-gray-300 text-sm mb-2">{label}</p>
          <p className="text-neon-cyan text-sm">Spent: ETB {spent.toLocaleString()}</p>
          <p className="text-gray-400 text-sm">Budget: ETB {budget.toLocaleString()}</p>
          <p className={`text-sm font-semibold ${
            percentage > 100 ? 'text-red-400' : 
            percentage > 80 ? 'text-yellow-400' : 'text-neon-green'
          }`}>
            {percentage}% of budget
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBar = (props) => {
    const { fill, payload, ...rest } = props;
    const percentage = (payload.amount / payload.budget) * 100;
    
    let color = "#39ff14"; // neon-green
    if (percentage > 100) color = "#ff4444"; // red
    else if (percentage > 80) color = "#ffa500"; // orange
    
    return <Bar {...rest} fill={color} />;
  };

  return (
    <Card className="p-6" hover={false}>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-1">Budget vs Spending</h3>
          <p className="text-gray-400 text-sm">Category-wise budget comparison</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.3}
              />
              
              <XAxis 
                dataKey="category" 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Budget bars (background) */}
              <Bar 
                dataKey="budget" 
                fill="#374151" 
                opacity={0.3}
                radius={[4, 4, 0, 0]}
              />
              
              {/* Spending bars (foreground) */}
              <Bar 
                dataKey="amount" 
                fill="#00ffff"
                radius={[4, 4, 0, 0]}
                shape={<CustomBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-600 opacity-50"></div>
            <span className="text-sm text-gray-400">Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-neon-cyan"></div>
            <span className="text-sm text-gray-400">Spent</span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-700/50">
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

export default CategoryChart;