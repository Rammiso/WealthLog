import { useState, Suspense, lazy, useEffect } from "react";
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

// Loading component
const LoadingCard = () => (
  <div className="glass p-6 rounded-xl border border-gray-700/50 animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
    <div className="h-32 bg-gray-700 rounded"></div>
  </div>
);

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { loadCategories, loadTransactions, loadGoals } = useApp();
  const { data: dashboardData, loadAllData, isLoading, refreshData } = useDashboardData();

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Load initial data
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
      budget: item.value * 1.2, // Mock budget as 120% of current spending
      type: item.type
    })) || [],
    
    recentTransactions: [], // Will be loaded separately
    
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
    <ErrorBoundary>
      <div className="min-h-screen bg-dark-gradient">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={handleSidebarToggle} 
        />

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          {/* Top Bar */}
          <TopBar />

          {/* Dashboard Content */}
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
        </div>
      </div>
    </ErrorBoundary>
  );
}