/**
 * API Service Layer
 * Centralized service for all backend API calls
 * Handles authentication, error handling, and request/response formatting
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiService {
  constructor() {
    this.token = null;
    this.refreshToken = null;
  }

  // Token management
  setTokens(accessToken, refreshToken = null) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('accessToken');
    }
    return this.token;
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // HTTP request helper
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.clearTokens();
          window.location.href = '/login';
          throw new ApiError('Authentication required', 401, data);
        }

        throw new ApiError(
          data.error?.message || data.message || 'Request failed',
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        'Network error. Please check your connection.',
        0,
        { originalError: error.message }
      );
    }
  }

  // HTTP method helpers
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication API
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      this.setTokens(response.data.token, response.data.refreshToken);
    }
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.success && response.data.token) {
      this.setTokens(response.data.token, response.data.refreshToken);
    }
    return response;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error.message);
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  // Categories API
  async getCategories(params = {}) {
    return this.get('/categories', params);
  }

  async createCategory(categoryData) {
    return this.post('/categories', categoryData);
  }

  async updateCategory(id, categoryData) {
    return this.put(`/categories/${id}`, categoryData);
  }

  async deleteCategory(id) {
    return this.delete(`/categories/${id}`);
  }

  // Transactions API
  async getTransactions(params = {}) {
    return this.get('/transactions', params);
  }

  async createTransaction(transactionData) {
    return this.post('/transactions', transactionData);
  }

  async updateTransaction(id, transactionData) {
    return this.put(`/transactions/${id}`, transactionData);
  }

  async deleteTransaction(id) {
    return this.delete(`/transactions/${id}`);
  }

  async getTransactionById(id) {
    return this.get(`/transactions/${id}`);
  }

  async getRecentTransactions(limit = 10) {
    return this.get('/transactions/recent', { limit });
  }

  async getTransactionSummary(period = 'month') {
    return this.get('/transactions/summary', { period });
  }

  async getSpendingByCategory(period = 'month') {
    return this.get('/transactions/spending-by-category', { period });
  }

  async searchTransactions(searchTerm, params = {}) {
    return this.get('/transactions/search', { q: searchTerm, ...params });
  }

  async bulkDeleteTransactions(transactionIds) {
    return this.delete('/transactions/bulk', { transactionIds });
  }

  // Goals API
  async getGoals(params = {}) {
    return this.get('/goals', params);
  }

  async createGoal(goalData) {
    return this.post('/goals', goalData);
  }

  async updateGoal(id, goalData) {
    return this.put(`/goals/${id}`, goalData);
  }

  async deleteGoal(id) {
    return this.delete(`/goals/${id}`);
  }

  async getGoalById(id) {
    return this.get(`/goals/${id}`);
  }

  async getActiveGoals() {
    return this.get('/goals/active');
  }

  async getOverdueGoals() {
    return this.get('/goals/overdue');
  }

  async getGoalsSummary() {
    return this.get('/goals/summary');
  }

  async updateGoalProgress(id, currentAmount) {
    return this.patch(`/goals/${id}/progress`, { currentAmount });
  }

  async addToGoalProgress(id, amount) {
    return this.patch(`/goals/${id}/add-progress`, { amount });
  }

  async completeGoal(id) {
    return this.patch(`/goals/${id}/complete`);
  }

  async pauseGoal(id) {
    return this.patch(`/goals/${id}/pause`);
  }

  async resumeGoal(id) {
    return this.patch(`/goals/${id}/resume`);
  }

  async searchGoals(searchTerm, params = {}) {
    return this.get('/goals/search', { q: searchTerm, ...params });
  }

  // Dashboard Analytics API
  async getExpensesPieData(month, year) {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    return this.get('/dashboard/expenses-pie', params);
  }

  async getIncomeLineData(months = 6) {
    return this.get('/dashboard/income-line', { months });
  }

  async getCategoryBarData(month, year, options = {}) {
    const params = { ...options };
    if (month) params.month = month;
    if (year) params.year = year;
    return this.get('/dashboard/category-bar', params);
  }

  async getGoalsProgressData(options = {}) {
    return this.get('/dashboard/goals-progress', options);
  }

  async getDashboardOverview(params = {}) {
    return this.get('/dashboard/overview', params);
  }

  async getDashboardStats() {
    return this.get('/dashboard/stats');
  }

  // Monthly Summary API
  async getMonthlySummary(month, year) {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    return this.get('/summary/monthly', params);
  }

  // Utility methods
  isAuthenticated() {
    return !!this.getToken();
  }

  formatCurrency(amount, currency = 'ETB') {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }

  formatDateTime(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }
}

// Custom error class for API errors
class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  isValidationError() {
    return this.status === 400 && this.data.error?.type === 'ValidationError';
  }

  isAuthenticationError() {
    return this.status === 401;
  }

  isForbiddenError() {
    return this.status === 403;
  }

  isNotFoundError() {
    return this.status === 404;
  }

  isServerError() {
    return this.status >= 500;
  }

  getValidationErrors() {
    if (this.isValidationError()) {
      return this.data.error.details || [];
    }
    return [];
  }
}

// Create and export singleton instance
const apiService = new ApiService();

export default apiService;
export { ApiError };