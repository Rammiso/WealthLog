import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, PieChart, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../Context/AppContext';

export default function Categories() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#FF6B6B',
    icon: '📊'
  });
  const { categories, loadCategories, createCategory, updateCategory, deleteCategory } = useApp();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await createCategory(formData);
    }
    
    setShowCategoryForm(false);
    setEditingCategory(null);
    setFormData({ name: '', type: 'expense', color: '#FF6B6B', icon: '📊' });
    loadCategories();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon
    });
    setShowCategoryForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId);
      loadCategories();
    }
  };

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const predefinedIcons = [
    '🍽️', '🚗', '🎬', '🛍️', '💡', '🏠', '💰', '💻', '🎯', '📊',
    '🏥', '📚', '✈️', '🎵', '🏋️', '🎨', '📱', '☕', '🎮', '👕'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
          <p className="text-gray-400">Organize your transactions with custom categories</p>
        </div>
        <motion.button
          onClick={() => setShowCategoryForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/20 transition-all duration-300 font-mono"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Add Category
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-xl border border-neon-cyan/30">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-8 h-8 text-neon-cyan" />
            <div>
              <h3 className="text-lg font-semibold text-white">Total Categories</h3>
              <p className="text-sm text-gray-400">All types</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-cyan">{categories.length}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-neon-green/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-neon-green" />
            <div>
              <h3 className="text-lg font-semibold text-white">Income Categories</h3>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-green">{incomeCategories.length}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Expense Categories</h3>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">{expenseCategories.length}</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <div className="glass rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-neon-green" />
              Income Categories
            </h2>
          </div>
          <div className="p-6 space-y-3">
            {incomeCategories.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No income categories yet</p>
              </div>
            ) : (
              incomeCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-dark-primary/30 rounded-lg border border-gray-700/50 hover:border-neon-green/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{category.name}</h3>
                      <p className="text-sm text-gray-400">Income category</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="glass rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-red-400" />
              Expense Categories
            </h2>
          </div>
          <div className="p-6 space-y-3">
            {expenseCategories.length === 0 ? (
              <div className="text-center py-8">
                <TrendingDown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No expense categories yet</p>
              </div>
            ) : (
              expenseCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-dark-primary/30 rounded-lg border border-gray-700/50 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{category.name}</h3>
                      <p className="text-sm text-gray-400">Expense category</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-dark-secondary border border-gray-700 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        formData.color === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 bg-dark-primary border border-gray-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                <div className="grid grid-cols-10 gap-2 mb-2">
                  {predefinedIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-lg ${
                        formData.icon === icon ? 'border-neon-cyan' : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                  placeholder="Enter emoji or text"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                    setFormData({ name: '', type: 'expense', color: '#FF6B6B', icon: '📊' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neon-cyan text-dark-primary rounded-lg font-medium hover:bg-neon-cyan/90 transition-colors"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}