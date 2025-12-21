import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingDown, Calendar, Search, Filter, PieChart } from 'lucide-react';
import { useApp } from '../Context/AppContext';
import TransactionForm from '../Components/Dashboard/TransactionForm';

export default function Expenses() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const { transactions, categories, loadTransactions, loadCategories, loadingStates } = useApp();

  useEffect(() => {
    loadTransactions(); // Load all transactions, filter locally
    loadCategories();
  }, [loadTransactions, loadCategories]);

  // Add safety checks for data
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  const expenseTransactions = safeTransactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const expenseCategories = safeCategories.filter(c => c.type === 'expense');

  // Show loading state
  if (loadingStates?.transactions) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading expense data...</p>
        </div>
      </div>
    );
  }

  // Group expenses by category
  const expensesByCategory = expenseCategories.map(category => {
    const categoryExpenses = expenseTransactions.filter(t => t.categoryId === category.id);
    const total = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
    return {
      ...category,
      total,
      count: categoryExpenses.length,
      percentage: totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0
    };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="p-6 space-y-6">
      {/* Quick Action Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={() => setShowTransactionForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-300 font-mono"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-xl border border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Total Expenses</h3>
              <p className="text-sm text-gray-400">This month</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">{totalExpenses.toLocaleString()} ETB</p>
        </div>

        <div className="glass p-6 rounded-xl border border-neon-cyan/30">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-neon-cyan" />
            <div>
              <h3 className="text-lg font-semibold text-white">Transactions</h3>
              <p className="text-sm text-gray-400">This month</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-cyan">{expenseTransactions.length}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-neon-magenta/30">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-8 h-8 text-neon-magenta" />
            <div>
              <h3 className="text-lg font-semibold text-white">Categories</h3>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-magenta">{expensesByCategory.length}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Average</h3>
              <p className="text-sm text-gray-400">Per transaction</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {expenseTransactions.length > 0 ? Math.round(totalExpenses / expenseTransactions.length).toLocaleString() : 0} ETB
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white">Expenses by Category</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expensesByCategory.map((category) => (
              <div key={category.id} className="p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-white">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{category.percentage}%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-red-400 font-medium">{category.total.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Transactions</span>
                    <span className="text-white">{category.count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-4 rounded-xl border border-gray-700/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark-primary/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-dark-primary/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
            >
              <option value="">All Categories</option>
              {expenseCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="glass rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white">Recent Expenses</h2>
        </div>
        <div className="divide-y divide-gray-700/50">
          {expenseTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <TrendingDown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No expense transactions yet</p>
              <button
                onClick={() => setShowTransactionForm(true)}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            expenseTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{transaction.description}</h3>
                      <p className="text-sm text-gray-400">{transaction.categoryName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-400">-{transaction.amount.toLocaleString()} ETB</p>
                    <p className="text-sm text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showTransactionForm}
        onClose={() => setShowTransactionForm(false)}
        onSuccess={() => {
          setShowTransactionForm(false);
          loadTransactions(); // Reload all transactions
        }}
        defaultType="expense"
      />
    </div>
  );
}