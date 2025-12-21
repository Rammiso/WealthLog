import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Calendar, TrendingUp, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useApp } from '../Context/AppContext';

export default function Goals() {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    endDate: '',
    priority: 'medium'
  });
  const { goals, loadGoals, createGoal, updateGoal, deleteGoal, loadingStates } = useApp();

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // Add safety checks for data
  const safeGoals = Array.isArray(goals) ? goals : [];
  
  const activeGoals = safeGoals.filter(g => g.status === 'active');
  const completedGoals = safeGoals.filter(g => g.status === 'completed');
  const totalTargetAmount = safeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = safeGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  // Show loading state
  if (loadingStates?.goals) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading goals...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      currency: 'ETB'
    };

    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData);
    } else {
      await createGoal(goalData);
    }
    
    setShowGoalForm(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      endDate: '',
      priority: 'medium'
    });
    loadGoals();
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      endDate: goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : '',
      priority: goal.priority
    });
    setShowGoalForm(true);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goalId);
      loadGoals();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-500/30';
      case 'medium': return 'text-yellow-400 border-yellow-500/30';
      case 'low': return 'text-green-400 border-green-500/30';
      default: return 'text-gray-400 border-gray-500/30';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-neon-green';
    if (progress >= 75) return 'bg-neon-cyan';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Quick Action Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={() => setShowGoalForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/20 transition-all duration-300 font-mono"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Add Goal
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-xl border border-neon-cyan/30">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-neon-cyan" />
            <div>
              <h3 className="text-lg font-semibold text-white">Total Goals</h3>
              <p className="text-sm text-gray-400">All time</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-cyan">{goals.length}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-neon-green/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-neon-green" />
            <div>
              <h3 className="text-lg font-semibold text-white">Active Goals</h3>
              <p className="text-sm text-gray-400">In progress</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-green">{activeGoals.length}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Completed</h3>
              <p className="text-sm text-gray-400">Achieved</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{completedGoals.length}</p>
        </div>

        <div className="glass p-6 rounded-xl border border-neon-magenta/30">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-neon-magenta" />
            <div>
              <h3 className="text-lg font-semibold text-white">Progress</h3>
              <p className="text-sm text-gray-400">Overall</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-neon-magenta">
            {totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full glass p-12 rounded-xl border border-gray-700/50 text-center">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Goals Yet</h3>
            <p className="text-gray-400 mb-6">Start by creating your first financial goal</p>
            <button
              onClick={() => setShowGoalForm(true)}
              className="px-6 py-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/20 transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const isCompleted = progress >= 100;
            const daysLeft = goal.endDate ? Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
            
            return (
              <motion.div
                key={goal.id}
                className={`glass p-6 rounded-xl border transition-all duration-300 hover:border-neon-cyan/50 ${
                  isCompleted ? 'border-neon-green/30' : 'border-gray-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{goal.title}</h3>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-neon-green" />}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{goal.description}</p>
                    <div className={`inline-block px-2 py-1 rounded text-xs border ${getPriorityColor(goal.priority)}`}>
                      {goal.priority.toUpperCase()} PRIORITY
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{Math.round(progress)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(progress)}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current</span>
                    <span className="text-neon-cyan font-medium">{goal.currentAmount.toLocaleString()} ETB</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Target</span>
                    <span className="text-white font-medium">{goal.targetAmount.toLocaleString()} ETB</span>
                  </div>

                  {daysLeft !== null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Deadline</span>
                      <span className={`font-medium ${
                        daysLeft < 0 ? 'text-red-400' : daysLeft < 30 ? 'text-yellow-400' : 'text-neon-green'
                      }`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : 
                         daysLeft === 0 ? 'Due today' : 
                         `${daysLeft} days left`}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-dark-secondary border border-gray-700 rounded-xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Amount (ETB)</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Amount (ETB)</label>
                <input
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoalForm(false);
                    setEditingGoal(null);
                    setFormData({
                      title: '',
                      description: '',
                      targetAmount: '',
                      currentAmount: '',
                      endDate: '',
                      priority: 'medium'
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neon-cyan text-dark-primary rounded-lg font-medium hover:bg-neon-cyan/90 transition-colors"
                >
                  {editingGoal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}