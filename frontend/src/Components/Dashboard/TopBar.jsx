import { Bell, Search, User, ChevronDown, Plus, Target, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useCallback, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import TransactionForm from "./TransactionForm";

const TopBar = memo(function TopBar({ currentPath = "/dashboard" }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get page title based on current path
  const getPageTitle = () => {
    switch (currentPath) {
      case '/dashboard/income':
        return { title: 'Income Management', subtitle: 'Track and manage your income sources' };
      case '/dashboard/expenses':
        return { title: 'Expense Tracking', subtitle: 'Monitor and control your spending' };
      case '/dashboard/categories':
        return { title: 'Category Management', subtitle: 'Organize your financial categories' };
      case '/dashboard/goals':
        return { title: 'Financial Goals', subtitle: 'Set and track your financial objectives' };
      case '/dashboard/settings':
        return { title: 'Settings', subtitle: 'Customize your account preferences' };
      case '/dashboard/profile':
        return { title: 'Profile', subtitle: 'Manage your personal information' };
      default:
        return { title: 'Dashboard', subtitle: "Welcome back! Here's your financial overview." };
    }
  };

  const { title, subtitle } = getPageTitle();

  const notifications = [
    { id: 1, message: "Budget limit reached for Food category", type: "warning", time: "2 min ago" },
    { id: 2, message: "Monthly salary deposited", type: "success", time: "1 hour ago" },
    { id: 3, message: "Goal deadline approaching: Emergency Fund", type: "info", time: "3 hours ago" }
  ];

  const closeDropdowns = useCallback(() => {
    setShowNotifications(false);
    setShowProfile(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeDropdowns();
      }
    };

    if (showNotifications || showProfile) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showNotifications, showProfile, closeDropdowns]);

  return (
    <>
      <header className="bg-dark-secondary/50 backdrop-blur-xl border-b border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <motion.button
                onClick={() => setShowTransactionForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green hover:bg-neon-green/20 transition-all duration-300 font-mono text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </motion.button>
              
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/20 transition-all duration-300 font-mono text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Target className="w-4 h-4" />
                New Goal
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="bg-dark-primary/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-100 placeholder-gray-500 focus:border-neon-cyan focus:outline-none transition-colors w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-neon-cyan/10 transition-colors text-gray-400 hover:text-neon-cyan"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-magenta rounded-full text-xs flex items-center justify-center text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-dark-secondary border border-gray-700 rounded-lg shadow-2xl z-50">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-semibold text-gray-100">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            notification.type === 'success' ? 'bg-neon-green' :
                            'bg-neon-cyan'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-200">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center">
                    <button className="text-neon-cyan text-sm hover:text-neon-blue transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-neon-cyan/10 transition-colors"
              >
                <div className="w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center">
                  <User size={16} className="text-dark-primary" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-200">
                    {user?.fullName || `${user?.firstName} ${user?.lastName}` || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">Premium User</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-dark-secondary border border-gray-700 rounded-lg shadow-2xl z-50">
                  <div className="p-2">
                    <button 
                      onClick={() => navigate('/dashboard/profile')}
                      className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors text-gray-200 text-sm"
                    >
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => navigate('/dashboard/settings')}
                      className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors text-gray-200 text-sm"
                    >
                      Account Preferences
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors text-gray-200 text-sm">
                      Help & Support
                    </button>
                    <hr className="my-2 border-gray-700" />
                    <button 
                      onClick={logout}
                      className="w-full text-left p-2 rounded hover:bg-red-500/10 transition-colors text-red-400 text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(showNotifications || showProfile) && (
          <div
            className="fixed inset-0 z-40"
            onClick={closeDropdowns}
          />
        )}
      </header>
      
      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showTransactionForm}
        onClose={() => setShowTransactionForm(false)}
        onSuccess={() => {
          // Refresh dashboard data
          window.location.reload(); // Simple refresh for now
        }}
      />
    </>
  );
});

export default TopBar;