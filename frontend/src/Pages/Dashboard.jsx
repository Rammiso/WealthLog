import { useState, Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "../Components/ErrorBoundary";
import Sidebar from "../Components/Dashboard/Sidebar";
import TopBar from "../Components/Dashboard/TopBar";
import { useAuth } from "../Context/AuthContext";
import { useApp } from "../Context/AppContext";
import useDashboardData from "../hooks/useDashboardData";

// Lazy load components to prevent initial render issues
const SummaryCards = lazy(() => import("../Components/Dashboard/SummaryCards"));
const SimpleIncomeChart = lazy(() => import("../Components/Dashboard/SimpleIncomeChart"));
const SimpleExpenseChart = lazy(() => import("../Components/Dashboard/SimpleExpenseChart"));
const SimpleCategoryChart = lazy(() => import("../Components/Dashboard/SimpleCategoryChart"));
const RecentTransactions = lazy(() => import("../Components/Dashboard/RecentTransactions"));
const GoalsProgress = lazy(() => import("../Components/Dashboard/GoalsProgress"));

// Lazy load page components
const Income = lazy(() => import("./Income"));
const Expenses = lazy(() => import("./Expenses"));
const Categories = lazy(() => import("./Categories"));
const Goals = lazy(() => import("./Goals"));
const Settings = lazy(() => import("./Settings"));
const Profile = lazy(() => import("./Profile"));

// Loading component
const LoadingCard = () => (
  <div className="glass p-6 rounded-xl border border-gray-700/50 animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
    <div className="h-32 bg-gray-700 rounded"></div>
  </div>
);

const LoadingPage = () => (
  <div className="p-4 lg:p-6 space-y-6">
    <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {Array(4).fill(0).map((_, i) => <LoadingCard key={i} />)}
    </div>
  </div>
);

// Dashboard Home Component
const DashboardHome = ({ dashboardData, isLoading, refreshData, user }) => {
  const { transactions } = useApp();
  
  // Get recent transactions (last 5) - ensure transactions is an array
  const recentTransactions = Array.isArray(transactions) 
    ? transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(transaction => ({
          id: transaction.id,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.categoryName || 'Other',
          date: transaction.date
        }))
    : [];

  // Transform dashboard data for components
  const transformedData = {
    summary: dashboardData.stats ? {
      totalIncome: dashboardData.stats.currentMonth?.totalIncome || 0,
      totalExpenses: dashboardData.stats.currentMonth?.totalExpenses || 0,
      remainingBalance: dashboardData.stats.currentMonth?.netIncome || 0,
      activeGoals: dashboardData.stats.goals?.active || 0,
      currency: user?.currency || "ETB"
    } : {
      totalIncome: 0,
      totalExpenses: 0,
      remainingBalance: 0,
      activeGoals: 0,
      currency: "ETB"
    },
    
    monthlyData: dashboardData.incomeLine?.data || [],
    
    expenseCategories: dashboardData.expensesPie?.data || [],
    
    categorySpending: dashboardData.categoryBar?.data?.map(item => ({
      category: item.name,
      amount: item.value,
      type: item.type
    })) || [],
    
    recentTransactions: recentTransactions,
    
    goals: dashboardData.goalsProgress?.data?.map(goal => ({
      id: goal.id,
      title: goal.title,
      target: goal.targetAmount,
      current: goal.currentAmount,
      deadline: goal.endDate,
      progress: goal.progressPercentage
    })) || []
  };

  return (
    <main className="p-4 lg:p-6 space-y-6">
      {/* Summary Cards */}
      <ErrorBoundary>
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">{Array(4).fill(0).map((_, i) => <LoadingCard key={i} />)}</div>}>
          <SummaryCards data={transformedData.summary} isLoading={isLoading} />
        </Suspense>
      </ErrorBoundary>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="xl:col-span-2">
          <ErrorBoundary>
            <Suspense fallback={<LoadingCard />}>
              <SimpleIncomeChart 
                data={transformedData.monthlyData} 
                isLoading={isLoading}
                onRefresh={() => refreshData('incomeLine', 6)}
              />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Expense Distribution */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard />}>
            <SimpleExpenseChart 
              data={transformedData.expenseCategories} 
              isLoading={isLoading}
              onRefresh={() => refreshData('expensesPie')}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Category Spending */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard />}>
            <SimpleCategoryChart 
              data={transformedData.categorySpending} 
              isLoading={isLoading}
              onRefresh={() => refreshData('categoryBar')}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Goals Progress */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard />}>
            <GoalsProgress 
              data={transformedData.goals} 
              isLoading={isLoading}
              onRefresh={() => refreshData('goalsProgress')}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Recent Transactions */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard />}>
            <RecentTransactions 
              data={transformedData.recentTransactions} 
              isLoading={isLoading}
              onRefresh={() => refreshData('stats')}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
};

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { categories, transactions, loadCategories, loadTransactions, loadGoals, createTransaction, createGoal } = useApp();
  const { data: dashboardData, loadAllData, isLoading, refreshData } = useDashboardData();
  const location = useLocation();

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Load initial data and handle onboarding data
  useEffect(() => {
    const initializeDashboard = async () => {
      // Load basic data first
      await Promise.all([
        loadCategories(),
        loadTransactions({ limit: 10 }),
        loadGoals({ limit: 10 }),
      ]);
      
      // Then load dashboard analytics
      await loadAllData();
    };

    if (user) {
      initializeDashboard();
    }
  }, [user, loadCategories, loadTransactions, loadGoals, loadAllData]);

  // Handle initial data creation after categories are loaded
  useEffect(() => {
    const handleInitialData = async () => {
      const initialData = location.state?.initialData;
      if (initialData && user && categories.length > 0) {
        try {
          // Create initial income transaction if provided
          if (initialData.income && parseFloat(initialData.income) > 0) {
            // Find the Salary category for income
            const salaryCategory = categories.find(cat => 
              cat.type === 'income' && cat.name.toLowerCase().includes('salary')
            );
            
            const incomeData = {
              amount: parseFloat(initialData.income),
              description: 'Initial Monthly Income',
              type: 'income',
              categoryId: salaryCategory ? salaryCategory.id : categories.find(cat => cat.type === 'income')?.id,
              date: new Date().toISOString().split('T')[0],
              currency: user.currency || 'ETB'
            };
            
            if (incomeData.categoryId) {
              await createTransaction(incomeData);
              console.log('Initial income transaction created successfully');
            } else {
              console.warn('No income category found for initial transaction');
            }
          }

          // Create initial financial goal if provided
          if (initialData.financialGoal && initialData.financialGoal.trim()) {
            const goalData = {
              title: 'Primary Financial Goal',
              description: initialData.financialGoal,
              targetAmount: parseFloat(initialData.income) * 6 || 10000, // Default to 6 months of income or 10000
              currentAmount: 0,
              endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
              priority: 'high',
              currency: user.currency || 'ETB'
            };
            
            await createGoal(goalData);
            console.log('Initial financial goal created successfully');
          }

          // Clear the initial data from location state to prevent re-creation
          window.history.replaceState({}, document.title);
          
          // Reload data to show the new transactions/goals
          setTimeout(async () => {
            await Promise.all([
              loadTransactions(),
              loadGoals(),
              loadAllData()
            ]);
          }, 1000);
        } catch (error) {
          console.error('Error creating initial data:', error);
        }
      }
    };

    handleInitialData();
  }, [user, categories, location.state, createTransaction, createGoal, loadTransactions, loadGoals, loadAllData]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-dark-gradient">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={handleSidebarToggle}
          currentPath={location.pathname}
        />

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          {/* Top Bar */}
          <TopBar currentPath={location.pathname} />

          {/* Dashboard Content with Routing */}
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route path="/" element={
                <DashboardHome 
                  dashboardData={dashboardData}
                  isLoading={isLoading}
                  refreshData={refreshData}
                  user={user}
                />
              } />
              <Route path="/income" element={<Income />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
}