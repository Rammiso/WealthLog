import { createContext, useContext, useReducer, useCallback } from 'react';
import apiService from '../services/apiService';

// App context
const AppContext = createContext();

// App actions
const APP_ACTIONS = {
  // Loading states
  SET_LOADING: 'SET_LOADING',
  
  // Categories
  LOAD_CATEGORIES_START: 'LOAD_CATEGORIES_START',
  LOAD_CATEGORIES_SUCCESS: 'LOAD_CATEGORIES_SUCCESS',
  LOAD_CATEGORIES_FAILURE: 'LOAD_CATEGORIES_FAILURE',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  
  // Transactions
  LOAD_TRANSACTIONS_START: 'LOAD_TRANSACTIONS_START',
  LOAD_TRANSACTIONS_SUCCESS: 'LOAD_TRANSACTIONS_SUCCESS',
  LOAD_TRANSACTIONS_FAILURE: 'LOAD_TRANSACTIONS_FAILURE',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  
  // Goals
  LOAD_GOALS_START: 'LOAD_GOALS_START',
  LOAD_GOALS_SUCCESS: 'LOAD_GOALS_SUCCESS',
  LOAD_GOALS_FAILURE: 'LOAD_GOALS_FAILURE',
  ADD_GOAL: 'ADD_GOAL',
  UPDATE_GOAL: 'UPDATE_GOAL',
  DELETE_GOAL: 'DELETE_GOAL',
  
  // Dashboard
  LOAD_DASHBOARD_START: 'LOAD_DASHBOARD_START',
  LOAD_DASHBOARD_SUCCESS: 'LOAD_DASHBOARD_SUCCESS',
  LOAD_DASHBOARD_FAILURE: 'LOAD_DASHBOARD_FAILURE',
  
  // Notifications
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  
  // Error handling
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  // Loading states
  isLoading: false,
  loadingStates: {},
  
  // Data
  categories: [],
  transactions: [],
  goals: [],
  dashboardData: null,
  
  // Pagination and filters
  transactionsPagination: null,
  goalsPagination: null,
  filters: {
    transactions: {},
    goals: {},
  },
  
  // UI state
  notifications: [],
  error: null,
  
  // Cache timestamps
  lastUpdated: {
    categories: null,
    transactions: null,
    goals: null,
    dashboard: null,
  },
};

// App reducer
function appReducer(state, action) {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.key]: action.payload.loading,
        },
      };

    // Categories
    case APP_ACTIONS.LOAD_CATEGORIES_START:
      return {
        ...state,
        loadingStates: { ...state.loadingStates, categories: true },
      };

    case APP_ACTIONS.LOAD_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload.categories,
        loadingStates: { ...state.loadingStates, categories: false },
        lastUpdated: { ...state.lastUpdated, categories: Date.now() },
        error: null,
      };

    case APP_ACTIONS.LOAD_CATEGORIES_FAILURE:
      return {
        ...state,
        loadingStates: { ...state.loadingStates, categories: false },
        error: action.payload.error,
      };

    case APP_ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...(Array.isArray(state.categories) ? state.categories : []), action.payload.category],
      };

    case APP_ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: Array.isArray(state.categories)
          ? state.categories.map(cat =>
              cat.id === action.payload.category.id ? action.payload.category : cat
            )
          : [action.payload.category],
      };

    case APP_ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: Array.isArray(state.categories) 
          ? state.categories.filter(cat => cat.id !== action.payload.categoryId)
          : [],
      };

    // Transactions
    case APP_ACTIONS.LOAD_TRANSACTIONS_START:
      return {
        ...state,
        loadingStates: { ...state.loadingStates, transactions: true },
      };

    case APP_ACTIONS.LOAD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload.transactions,
        transactionsPagination: action.payload.pagination,
        loadingStates: { ...state.loadingStates, transactions: false },
        lastUpdated: { ...state.lastUpdated, transactions: Date.now() },
        error: null,
      };

    case APP_ACTIONS.LOAD_TRANSACTIONS_FAILURE:
      return {
        ...state,
        loadingStates: { ...state.loadingStates, transactions: false },
        error: action.payload.error,
      };

    case APP_ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload.transaction, ...(Array.isArray(state.transactions) ? state.transactions : [])],
      };

    case APP_ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: Array.isArray(state.transactions) 
          ? state.transactions.map(txn =>
              txn.id === action.payload.transaction.id ? action.payload.transaction : txn
            )
          : [action.payload.transaction],
      };

    case APP_ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: Array.isArray(state.transactions) 
          ? state.transactions.filter(txn => txn.id !== action.payload.transactionId)
          : [],
      };

    // Goals
    case APP_ACTIONS.LOAD_GOALS_START:
      return {
        ...state,
        loadingStates: { ...state.loadingStates, goals: true },
      };

    case APP_ACTIONS.LOAD_GOALS_SUCCESS:
      return {
        ...state,
        goals: action.payload.goals,
        goalsPagination: action.payload.pagination,
        loadingStates: { ...state.loadingStates, goals: false },
        lastUpdated: { ...state.lastUpdated, goals: Date.now() },
        error: null,
      };

    case APP_ACTIONS.LOAD_GOALS_FAILURE:
      return {
        ...state,
        loadingStates: { ...state.loadingStates, goals: false },
        error: action.payload.error,
      };

    case APP_ACTIONS.ADD_GOAL:
      return {
        ...state,
        goals: [...(Array.isArray(state.goals) ? state.goals : []), action.payload.goal],
      };

    case APP_ACTIONS.UPDATE_GOAL:
      return {
        ...state,
        goals: Array.isArray(state.goals)
          ? state.goals.map(goal =>
              goal.id === action.payload.goal.id ? action.payload.goal : goal
            )
          : [action.payload.goal],
      };

    case APP_ACTIONS.DELETE_GOAL:
      return {
        ...state,
        goals: Array.isArray(state.goals)
          ? state.goals.filter(goal => goal.id !== action.payload.goalId)
          : [],
      };

    // Dashboard
    case APP_ACTIONS.LOAD_DASHBOARD_START:
      return {
        ...state,
        loadingStates: { ...state.loadingStates, dashboard: true },
      };

    case APP_ACTIONS.LOAD_DASHBOARD_SUCCESS:
      return {
        ...state,
        dashboardData: action.payload.dashboardData,
        loadingStates: { ...state.loadingStates, dashboard: false },
        lastUpdated: { ...state.lastUpdated, dashboard: Date.now() },
        error: null,
      };

    case APP_ACTIONS.LOAD_DASHBOARD_FAILURE:
      return {
        ...state,
        loadingStates: { ...state.loadingStates, dashboard: false },
        error: action.payload.error,
      };

    // Notifications
    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload.notification],
      };

    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload.notificationId),
      };

    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    // Error handling
    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// App provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Notification helper
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const notificationWithId = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    dispatch({
      type: APP_ACTIONS.ADD_NOTIFICATION,
      payload: { notification: notificationWithId },
    });

    // Auto-remove notification after duration
    if (notificationWithId.duration > 0) {
      setTimeout(() => {
        dispatch({
          type: APP_ACTIONS.REMOVE_NOTIFICATION,
          payload: { notificationId: id },
        });
      }, notificationWithId.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({
      type: APP_ACTIONS.REMOVE_NOTIFICATION,
      payload: { notificationId: id },
    });
  }, []);

  // Categories actions
  const loadCategories = useCallback(async (params = {}) => {
    dispatch({ type: APP_ACTIONS.LOAD_CATEGORIES_START });
    try {
      const response = await apiService.getCategories(params);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.LOAD_CATEGORIES_SUCCESS,
          payload: { categories: response.data.data || response.data },
        });
      } else {
        throw new Error(response.message || 'Failed to load categories');
      }
    } catch (error) {
      dispatch({
        type: APP_ACTIONS.LOAD_CATEGORIES_FAILURE,
        payload: { error: error.message },
      });
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load categories',
      });
    }
  }, [addNotification]);

  const createCategory = useCallback(async (categoryData) => {
    try {
      const response = await apiService.createCategory(categoryData);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.ADD_CATEGORY,
          payload: { category: response.data },
        });
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Category created successfully',
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create category');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create category',
      });
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      const response = await apiService.updateCategory(id, categoryData);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.UPDATE_CATEGORY,
          payload: { category: response.data },
        });
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Category updated successfully',
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update category');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update category',
      });
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  const deleteCategory = useCallback(async (id) => {
    try {
      const response = await apiService.deleteCategory(id);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.DELETE_CATEGORY,
          payload: { categoryId: id },
        });
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Category deleted successfully',
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete category');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete category',
      });
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  // Transactions actions
  const loadTransactions = useCallback(async (params = {}) => {
    dispatch({ type: APP_ACTIONS.LOAD_TRANSACTIONS_START });
    try {
      const response = await apiService.getTransactions(params);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.LOAD_TRANSACTIONS_SUCCESS,
          payload: {
            transactions: response.data.data || response.data,
            pagination: response.data.pagination,
          },
        });
      } else {
        throw new Error(response.message || 'Failed to load transactions');
      }
    } catch (error) {
      dispatch({
        type: APP_ACTIONS.LOAD_TRANSACTIONS_FAILURE,
        payload: { error: error.message },
      });
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load transactions',
      });
    }
  }, [addNotification]);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      const response = await apiService.createTransaction(transactionData);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.ADD_TRANSACTION,
          payload: { transaction: response.data },
        });
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Transaction created successfully',
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create transaction');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create transaction',
      });
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      const response = await apiService.updateTransaction(id, transactionData);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.UPDATE_TRANSACTION,
          payload: { transaction: response.data },
        });
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Transaction updated successfully',
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update transaction');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update transaction',
      });
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      const response = await apiService.deleteTransaction(id);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.DELETE_TRANSACTION,
          payload: { transactionId: id },
        });
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Transaction deleted successfully',
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete transaction');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete transaction',
      });
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  // Goals actions
  const loadGoals = useCallback(async (params = {}) => {
    dispatch({ type: APP_ACTIONS.LOAD_GOALS_START });
    try {
      const response = await apiService.getGoals(params);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.LOAD_GOALS_SUCCESS,
          payload: {
            goals: response.data.data || response.data,
            pagination: response.data.pagination,
          },
        });
      } else {
        throw new Error(response.message || 'Failed to load goals');
      }
    } catch (error) {
      dispatch({
        type: APP_ACTIONS.LOAD_GOALS_FAILURE,
        payload: { error: error.message },
      });
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load goals',
      });
    }
  }, [addNotification]);

  const createGoal = useCallback(async (goalData) => {
    try {
      const response = await apiService.createGoal(goalData);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.ADD_GOAL,
          payload: { goal: response.data },
        });
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Goal created successfully',
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create goal');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create goal',
      });
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  const updateGoal = useCallback(async (id, goalData) => {
    try {
      const response = await apiService.updateGoal(id, goalData);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.UPDATE_GOAL,
          payload: { goal: response.data },
        });
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Goal updated successfully',
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update goal');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update goal',
      });
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  const deleteGoal = useCallback(async (id) => {
    try {
      const response = await apiService.deleteGoal(id);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.DELETE_GOAL,
          payload: { goalId: id },
        });
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Goal deleted successfully',
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete goal');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete goal',
      });
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  // Dashboard actions
  const loadDashboardData = useCallback(async (params = {}) => {
    dispatch({ type: APP_ACTIONS.LOAD_DASHBOARD_START });
    try {
      const response = await apiService.getDashboardOverview(params);
      if (response.success) {
        dispatch({
          type: APP_ACTIONS.LOAD_DASHBOARD_SUCCESS,
          payload: { dashboardData: response.data },
        });
      } else {
        throw new Error(response.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      dispatch({
        type: APP_ACTIONS.LOAD_DASHBOARD_FAILURE,
        payload: { error: error.message },
      });
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data',
      });
    }
  }, [addNotification]);

  // Context value
  const value = {
    ...state,
    // Actions
    addNotification,
    removeNotification,
    // Categories
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    // Transactions
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    // Goals
    loadGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    // Dashboard
    loadDashboardData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use app context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;