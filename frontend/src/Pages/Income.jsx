import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Calendar, Search, Filter } from 'lucide-react';
import { useApp } from '../Context/AppContext';
import TransactionForm from '../Components/Dashboard/TransactionForm';

export default function Income() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { transactions, categories, loadTransactions, loadCategories } = useApp();

  useEffect(() => {
    loadTransactions({ type: 'income' });
    loadCategories();
  }, [loadTransactions, loadCategories]);

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Income Management</h1>
          <p className="text-gray-400">Track and manage your income sources</p>
        </div>
        <motion.button
          onClick={() => setShowTransactionForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green hover:bg-neon-green/20 transition-all duration-300 font-mono"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Add Income
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-xl border border-neon-green/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-neon-green" />
            <div>
              <h3 className="text-lg font-semibold text-white">Total Income</h3>
              <p className="text-sm text-gray-400">This month</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-green">{totalIncome.toLocaleString()} ETB</p>
        </div>

        <div className="glass p-6 rounded-xl border border-neon-cyan/30">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-neon-cyan" />
            <div>
              <h3 className="text-lg font-semibold text-white">Transactions</h3>
              <p className="text-sm text-gray-400">This month</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-cyan">{incomeTransactions.length}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-neon-magenta/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-neon-magenta" />
            <div>
              <h3 className="text-lg font-semibold text-white">Average</h3>
              <p className="text-sm text-gray-400">Per transaction</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-magenta">
            {incomeTransactions.length > 0 ? Math.round(totalIncome / incomeTransactions.length).toLocaleString() : 0} ETB
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-4 rounded-xl border border-gray-700/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search income..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark-primary/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-dark-primary/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Income List */}
      <div className="glass rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white">Recent Income</h2>
        </div>
        <div className="divide-y divide-gray-700/50">
          {incomeTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No income transactions yet</p>
              <button
                onClick={() => setShowTransactionForm(true)}
                className="px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green hover:bg-neon-green/20 transition-colors"
              >
                Add Your First Income
              </button>
            </div>
          ) : (
            incomeTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neon-green/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-neon-green" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{transaction.description}</h3>
                      <p className="text-sm text-gray-400">{transaction.categoryName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neon-green">+{transaction.amount.toLocaleString()} ETB</p>
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
          loadTransactions({ type: 'income' });
        }}
        defaultType="income"
      />
    </div>
  );
}