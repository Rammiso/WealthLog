import { memo } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingBag, 
  Car, 
  Utensils, 
  Gamepad2, 
  Zap,
  Heart,
  MoreHorizontal,
  TrendingUp
} from "lucide-react";
import Card from "../ui/Card";

const categoryIcons = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Gamepad2,
  Bills: Zap,
  Healthcare: Heart,
  Income: TrendingUp
};

const RecentTransactions = memo(function RecentTransactions({ data }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    const absAmount = Math.abs(amount);
    return `ETB ${absAmount.toLocaleString()}`;
  };

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card className="p-6" hover={false}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-1">Recent Transactions</h3>
            <p className="text-gray-400 text-sm">Latest financial activity</p>
          </div>
          
          <button className="text-neon-cyan hover:text-neon-blue transition-colors text-sm font-medium">
            View All
          </button>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No transactions yet</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-3 bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg text-neon-cyan text-sm font-medium hover:bg-neon-cyan/20 transition-colors">
              Add Income
            </button>
            <button className="flex-1 py-2 px-3 bg-neon-magenta/10 border border-neon-magenta/20 rounded-lg text-neon-magenta text-sm font-medium hover:bg-neon-magenta/20 transition-colors">
              Add Expense
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" hover={false}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-1">Recent Transactions</h3>
            <p className="text-gray-400 text-sm">Latest financial activity</p>
          </div>
          
          <button className="text-neon-cyan hover:text-neon-blue transition-colors text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {data.map((transaction, index) => {
            const IconComponent = categoryIcons[transaction.category] || MoreHorizontal;
            const isIncome = transaction.type === 'income';
            
            return (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                {/* Icon */}
                <div className={`p-3 rounded-lg ${
                  isIncome 
                    ? 'bg-neon-green/10 border border-neon-green/20' 
                    : 'bg-neon-magenta/10 border border-neon-magenta/20'
                }`}>
                  <IconComponent 
                    className={`w-5 h-5 ${
                      isIncome ? 'text-neon-green' : 'text-neon-magenta'
                    }`} 
                  />
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-100 truncate group-hover:text-neon-cyan transition-colors">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center gap-1">
                      {isIncome ? (
                        <ArrowUpRight className="w-4 h-4 text-neon-green" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-neon-magenta" />
                      )}
                      <span className={`font-semibold ${
                        isIncome ? 'text-neon-green' : 'text-neon-magenta'
                      }`}>
                        {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-400">{transaction.category}</span>
                    <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ArrowUpRight className="w-4 h-4 text-neon-green" />
                <span className="text-lg font-bold text-neon-green">
                  +ETB {data
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-400">Total Income</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ArrowDownRight className="w-4 h-4 text-neon-magenta" />
                <span className="text-lg font-bold text-neon-magenta">
                  -ETB {Math.abs(data
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0))
                    .toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-400">Total Expenses</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-3 bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg text-neon-cyan text-sm font-medium hover:bg-neon-cyan/20 transition-colors">
              Add Income
            </button>
            <button className="flex-1 py-2 px-3 bg-neon-magenta/10 border border-neon-magenta/20 rounded-lg text-neon-magenta text-sm font-medium hover:bg-neon-magenta/20 transition-colors">
              Add Expense
            </button>
          </div>
        </div>
      </Card>
  );
});

export default RecentTransactions;