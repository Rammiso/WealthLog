import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { useApp } from '../Context/AppContext';

export function useDashboardData() {
  const [data, setData] = useState({
    overview: null,
    expensesPie: null,
    incomeLine: null,
    categoryBar: null,
    goalsProgress: null,
    stats: null,
  });
  
  const [loading, setLoading] = useState({
    overview: false,
    expensesPie: false,
    incomeLine: false,
    categoryBar: false,
    goalsProgress: false,
    stats: false,
  });
  
  const [errors, setErrors] = useState({});
  const { addNotification } = useApp();

  const setLoadingState = useCallback((key, isLoading) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  }, []);

  const setError = useCallback((key, error) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  }, []);

  const clearError = useCallback((key) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  // Load dashboard overview
  const loadOverview = useCallback(async (params = {}) => {
    setLoadingState('overview', true);
    clearError('overview');
    
    try {
      const response = await apiService.getDashboardOverview(params);
      if (response.success) {
        setData(prev => ({ ...prev, overview: response.data }));
      } else {
        throw new Error(response.message || 'Failed to load dashboard overview');
      }
    } catch (error) {
      setError('overview', error.message);
      addNotification({
        type: 'error',
        title: 'Dashboard Error',
        message: 'Failed to load dashboard overview',
      });
    } finally {
      setLoadingState('overview', false);
    }
  }, [setLoadingState, clearError, setError, addNotification]);

  // Load expenses pie data
  const loadExpensesPie = useCallback(async (month, year) => {
    setLoadingState('expensesPie', true);
    clearError('expensesPie');
    
    try {
      const response = await apiService.getExpensesPieData(month, year);
      if (response.success) {
        setData(prev => ({ ...prev, expensesPie: response.data }));
      } else {
        throw new Error(response.message || 'Failed to load expenses data');
      }
    } catch (error) {
      setError('expensesPie', error.message);
      addNotification({
        type: 'error',
        title: 'Chart Error',
        message: 'Failed to load expenses chart data',
      });
    } finally {
      setLoadingState('expensesPie', false);
    }
  }, [setLoadingState, clearError, setError, addNotification]);

  // Load income line data
  const loadIncomeLine = useCallback(async (months = 6) => {
    setLoadingState('incomeLine', true);
    clearError('incomeLine');
    
    try {
      const response = await apiService.getIncomeLineData(months);
      if (response.success) {
        setData(prev => ({ ...prev, incomeLine: response.data }));
      } else {
        throw new Error(response.message || 'Failed to load income data');
      }
    } catch (error) {
      setError('incomeLine', error.message);
      addNotification({
        type: 'error',
        title: 'Chart Error',
        message: 'Failed to load income chart data',
      });
    } finally {
      setLoadingState('incomeLine', false);
    }
  }, [setLoadingState, clearError, setError, addNotification]);

  // Load category bar data
  const loadCategoryBar = useCallback(async (month, year, options = {}) => {
    setLoadingState('categoryBar', true);
    clearError('categoryBar');
    
    try {
      const response = await apiService.getCategoryBarData(month, year, options);
      if (response.success) {
        setData(prev => ({ ...prev, categoryBar: response.data }));
      } else {
        throw new Error(response.message || 'Failed to load category data');
      }
    } catch (error) {
      setError('categoryBar', error.message);
      addNotification({
        type: 'error',
        title: 'Chart Error',
        message: 'Failed to load category chart data',
      });
    } finally {
      setLoadingState('categoryBar', false);
    }
  }, [setLoadingState, clearError, setError, addNotification]);

  // Load goals progress data
  const loadGoalsProgress = useCallback(async (options = {}) => {
    setLoadingState('goalsProgress', true);
    clearError('goalsProgress');
    
    try {
      const response = await apiService.getGoalsProgressData(options);
      if (response.success) {
        setData(prev => ({ ...prev, goalsProgress: response.data }));
      } else {
        throw new Error(response.message || 'Failed to load goals data');
      }
    } catch (error) {
      setError('goalsProgress', error.message);
      addNotification({
        type: 'error',
        title: 'Goals Error',
        message: 'Failed to load goals progress data',
      });
    } finally {
      setLoadingState('goalsProgress', false);
    }
  }, [setLoadingState, clearError, setError, addNotification]);

  // Load dashboard stats
  const loadStats = useCallback(async () => {
    setLoadingState('stats', true);
    clearError('stats');
    
    try {
      const response = await apiService.getDashboardStats();
      if (response.success) {
        setData(prev => ({ ...prev, stats: response.data }));
      } else {
        throw new Error(response.message || 'Failed to load dashboard stats');
      }
    } catch (error) {
      setError('stats', error.message);
      addNotification({
        type: 'error',
        title: 'Stats Error',
        message: 'Failed to load dashboard statistics',
      });
    } finally {
      setLoadingState('stats', false);
    }
  }, [setLoadingState, clearError, setError, addNotification]);

  // Load all dashboard data
  const loadAllData = useCallback(async (params = {}) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    await Promise.all([
      loadOverview(params),
      loadExpensesPie(currentMonth, currentYear),
      loadIncomeLine(6),
      loadCategoryBar(currentMonth, currentYear),
      loadGoalsProgress({ status: 'active', limit: 10 }),
      loadStats(),
    ]);
  }, [loadOverview, loadExpensesPie, loadIncomeLine, loadCategoryBar, loadGoalsProgress, loadStats]);

  // Refresh specific data
  const refreshData = useCallback((dataType, ...args) => {
    switch (dataType) {
      case 'overview':
        return loadOverview(...args);
      case 'expensesPie':
        return loadExpensesPie(...args);
      case 'incomeLine':
        return loadIncomeLine(...args);
      case 'categoryBar':
        return loadCategoryBar(...args);
      case 'goalsProgress':
        return loadGoalsProgress(...args);
      case 'stats':
        return loadStats(...args);
      case 'all':
        return loadAllData(...args);
      default:
        console.warn(`Unknown data type: ${dataType}`);
    }
  }, [loadOverview, loadExpensesPie, loadIncomeLine, loadCategoryBar, loadGoalsProgress, loadStats, loadAllData]);

  // Check if any data is loading
  const isLoading = Object.values(loading).some(Boolean);

  // Check if there are any errors
  const hasErrors = Object.keys(errors).length > 0;

  return {
    data,
    loading,
    errors,
    isLoading,
    hasErrors,
    loadOverview,
    loadExpensesPie,
    loadIncomeLine,
    loadCategoryBar,
    loadGoalsProgress,
    loadStats,
    loadAllData,
    refreshData,
    clearError,
  };
}

export default useDashboardData;