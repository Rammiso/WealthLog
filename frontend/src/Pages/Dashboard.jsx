import { useState, Suspense, lazy, useMemo } from "react";
import ErrorBoundary from "../Components/ErrorBoundary";
import Sidebar from "../Components/Dashboard/Sidebar";
import TopBar from "../Components/Dashboard/TopBar";

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

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Mock data - memoized to prevent re-renders
  const dashboardData = useMemo(() => ({
    summary: {
      totalIncome: 45000,
      totalExpenses: 32500,
      remainingBalance: 12500,
      activeGoals: 3,
      currency: "ETB"
    },
    monthlyData: [
      { month: "Jan", income: 42000, expenses: 28000 },
      { month: "Feb", income: 45000, expenses: 31000 },
      { month: "Mar", income: 43000, expenses: 29500 },
      { month: "Apr", income: 47000, expenses: 33000 },
      { month: "May", income: 45000, expenses: 32500 },
      { month: "Jun", income: 48000, expenses: 35000 }
    ],
    expenseCategories: [
      { name: "Food & Dining", value: 8500, color: "#00ffff" },
      { name: "Transportation", value: 6200, color: "#ff00ff" },
      { name: "Shopping", value: 4800, color: "#00d4ff" },
      { name: "Entertainment", value: 3200, color: "#39ff14" },
      { name: "Bills & Utilities", value: 5500, color: "#bd00ff" },
      { name: "Healthcare", value: 2800, color: "#ff0080" },
      { name: "Others", value: 1500, color: "#ffa500" }
    ],
    categorySpending: [
      { category: "Food", amount: 8500, budget: 10000 },
      { category: "Transport", amount: 6200, budget: 7000 },
      { category: "Shopping", amount: 4800, budget: 5000 },
      { category: "Bills", amount: 5500, budget: 6000 },
      { category: "Entertainment", amount: 3200, budget: 4000 }
    ],
    recentTransactions: [
      { id: 1, description: "Grocery Shopping", amount: -1250, category: "Food", date: "2024-12-16", type: "expense" },
      { id: 2, description: "Salary Deposit", amount: 45000, category: "Income", date: "2024-12-15", type: "income" },
      { id: 3, description: "Uber Ride", amount: -180, category: "Transport", date: "2024-12-14", type: "expense" },
      { id: 4, description: "Netflix Subscription", amount: -199, category: "Entertainment", date: "2024-12-13", type: "expense" },
      { id: 5, description: "Freelance Payment", amount: 3500, category: "Income", date: "2024-12-12", type: "income" }
    ],
    goals: [
      { id: 1, title: "Emergency Fund", target: 50000, current: 32000, deadline: "2024-12-31" },
      { id: 2, title: "Vacation Savings", target: 15000, current: 8500, deadline: "2024-06-30" },
      { id: 3, title: "New Laptop", target: 25000, current: 18000, deadline: "2024-03-15" }
    ]
  }), []);

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
                <SummaryCards data={dashboardData.summary} />
              </Suspense>
            </ErrorBoundary>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Income vs Expenses Chart */}
              <div className="xl:col-span-2">
                <ErrorBoundary>
                  <Suspense fallback={<LoadingCard />}>
                    <SimpleIncomeChart data={dashboardData.monthlyData} />
                  </Suspense>
                </ErrorBoundary>
              </div>

              {/* Expense Distribution */}
              <ErrorBoundary>
                <Suspense fallback={<LoadingCard />}>
                  <SimpleExpenseChart data={dashboardData.expenseCategories} />
                </Suspense>
              </ErrorBoundary>

              {/* Category Spending */}
              <ErrorBoundary>
                <Suspense fallback={<LoadingCard />}>
                  <SimpleCategoryChart data={dashboardData.categorySpending} />
                </Suspense>
              </ErrorBoundary>

              {/* Goals Progress */}
              <ErrorBoundary>
                <Suspense fallback={<LoadingCard />}>
                  <GoalsProgress data={dashboardData.goals} />
                </Suspense>
              </ErrorBoundary>

              {/* Recent Transactions */}
              <ErrorBoundary>
                <Suspense fallback={<LoadingCard />}>
                  <RecentTransactions data={dashboardData.recentTransactions} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}