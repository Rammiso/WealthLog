import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { useApp } from '../../Context/AppContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function TransactionForm({ isOpen, onClose, transaction = null, onSuccess, defaultType = 'expense', onTransactionCreated }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    notes: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    type: defaultType,
    currency: 'ETB'
  });

  const [errors, setErrors] = useState({});
  const { categories, createTransaction, updateTransaction, loadCategories } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      loadCategories();
    }
  }, [categories.length, loadCategories]);

  // Populate form when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        description: transaction.description || '',
        notes: transaction.notes || '',
        categoryId: transaction.categoryId || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: transaction.type || 'expense',
        currency: transaction.currency || 'ETB'
      });
    } else {
      // Reset form for new transaction
      setFormData({
        amount: '',
        description: '',
        notes: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        type: defaultType,
        currency: 'ETB'
      });
    }
  }, [transaction]);

  const validateField = (name, value) => {
    switch (name) {
      case 'amount':
        if (!value) return 'Amount is required';
        if (isNaN(value) || parseFloat(value) <= 0) return 'Amount must be a positive number';
        break;
      case 'description':
        if (!value) return 'Description is required';
        if (value.length < 2) return 'Description must be at least 2 characters';
        break;
      case 'categoryId':
        if (!value) return 'Category is required';
        break;
      case 'date':
        if (!value) return 'Date is required';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (field !== 'notes') { // Notes is optional
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      let result;
      if (transaction) {
        result = await updateTransaction(transaction.id, transactionData);
      } else {
        result = await createTransaction(transactionData);
      }
      
      setIsLoading(false);
      
      if (result.success) {
        onSuccess && onSuccess(result.data);
        onTransactionCreated && onTransactionCreated(); // Refresh dashboard data
        onClose();
      }
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
        <Card className="p-4 sm:p-6 border-neon-cyan/30 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white font-secondary">
              {transaction 
                ? `Edit ${transaction.type === 'income' ? 'Income' : 'Expense'}` 
                : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`
              }
            </h2>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary border border-gray-700/50 hover:border-red-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income', categoryId: '' })}
                  className={`p-3 rounded-lg border font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                    formData.type === 'income'
                      ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                      : 'bg-dark-secondary/50 border-gray-700/50 text-gray-400 hover:border-neon-green/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4 mx-auto mb-1" />
                  Income
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense', categoryId: '' })}
                  className={`p-3 rounded-lg border font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                    formData.type === 'expense'
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-dark-secondary/50 border-gray-700/50 text-gray-400 hover:border-red-500/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DollarSign className="w-4 h-4 mx-auto mb-1" />
                  Expense
                </motion.button>
              </div>
            </div>

            {/* Amount */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
              <Input
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                error={errors.amount}
                className="pl-12"
                step="0.01"
                min="0"
              />
            </div>

            {/* Description */}
            <div className="relative">
              <FileText className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
              <Input
                label="Description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What was this for?"
                error={errors.description}
                className="pl-12"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <Tag className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-dark-secondary/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all duration-300 backdrop-blur-sm font-mono ${
                    errors.categoryId ? 'border-red-500/50' : 'border-gray-700/50'
                  }`}
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-400 font-mono">{errors.categoryId}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
              <Input
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                className="pl-12"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
                rows={3}
                className="w-full px-4 py-3 bg-dark-secondary/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all duration-300 backdrop-blur-sm font-mono resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-dark-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="font-mono">Saving...</span>
                  </div>
                ) : (
                  <span className="font-mono uppercase tracking-wider">
                    {transaction 
                      ? `Update ${transaction.type === 'income' ? 'Income' : 'Expense'}`
                      : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`
                    }
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}