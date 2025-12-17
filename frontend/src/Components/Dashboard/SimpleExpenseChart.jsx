import { memo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, TrendingDown } from "lucide-react";
import Card from "../ui/Card";

const SimpleExpenseChart = memo(function SimpleExpenseChart({ data = [], isLoading = false, onRefresh }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const hasData = data.length > 0 && total > 0;
  
  return (
    <Card className="p-6" hover={false}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-100 mb-1 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            Expense Distribution
          </h3>
          <p className="text-gray-400 text-sm">Breakdown by category this month</p>
        </div>
        {onRefresh && (
          <motion.button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary border border-gray-700/50 hover:border-neon-cyan/30 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        )}
      </div>

      {/* Chart Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 mb-6">
          <motion.div
            className="w-12 h-12 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : !hasData ? (
        <div className="flex flex-col items-center justify-center h-48 mb-6 text-center">
          <TrendingDown className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-gray-400 font-mono">No expense data available</p>
          <p className="text-gray-500 text-sm mt-1">Start tracking your expenses to see insights</p>
        </div>
      ) : (
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
            
            {/* Expense segments */}
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const previousPercentages = data.slice(0, index).reduce((sum, prevItem) => sum + (prevItem.value / total) * 100, 0);
              
              return (
                <motion.div
                  key={item.name}
                  className="absolute inset-0 rounded-full border-8 border-transparent"
                  style={{
                    borderTopColor: percentage > 25 ? item.color : 'transparent',
                    borderRightColor: percentage > 25 && percentage <= 50 ? item.color : 'transparent',
                    borderBottomColor: percentage > 50 && percentage <= 75 ? item.color : 'transparent',
                    borderLeftColor: percentage > 75 ? item.color : 'transparent',
                    transform: `rotate(${previousPercentages * 3.6}deg)`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                />
              );
            })}
            
            {/* Center content */}
            <div className="absolute inset-4 rounded-full bg-dark-secondary flex items-center justify-center">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="text-2xl font-bold text-gray-100">ETB</p>
                <p className="text-lg font-semibold text-neon-cyan">{(total / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-400">Total</p>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {hasData && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {data.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
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
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <motion.div 
            className="mt-6 pt-4 border-t border-gray-700/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-2xl font-bold text-gray-100">ETB {total.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Total Expenses</p>
          </motion.div>
        </>
      )}
    </Card>
  );
});

export default SimpleExpenseChart;