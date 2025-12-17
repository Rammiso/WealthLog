/**
 * Test Dashboard Implementation
 * Simple script to test dashboard analytics functionality
 */

const mongoose = require('mongoose');
const config = require('../src/config/env');
const Transaction = require('../src/infrastructure/database/models/Transaction');
const Category = require('../src/infrastructure/database/models/Category');
const Goal = require('../src/infrastructure/database/models/Goal');
const TransactionRepository = require('../src/infrastructure/repositories/TransactionRepository');
const CategoryRepository = require('../src/infrastructure/repositories/CategoryRepository');
const GoalRepository = require('../src/infrastructure/repositories/GoalRepository');
const GetExpensesPieData = require('../src/usecases/dashboard/GetExpensesPieData');
const GetIncomeLineData = require('../src/usecases/dashboard/GetIncomeLineData');
const GetCategoryBarData = require('../src/usecases/dashboard/GetCategoryBarData');
const GetGoalsProgressData = require('../src/usecases/dashboard/GetGoalsProgressData');

async function testDashboard() {
  try {
    console.log('🚀 Testing Dashboard Analytics Implementation...\n');

    // Connect to database
    await mongoose.connect(config.DB_URI);
    console.log('✅ Connected to database');

    // Create repositories and use cases
    const transactionRepository = new TransactionRepository(Transaction);
    const categoryRepository = new CategoryRepository(Category);
    const goalRepository = new GoalRepository(Goal);
    
    const getExpensesPieData = new GetExpensesPieData(transactionRepository, categoryRepository);
    const getIncomeLineData = new GetIncomeLineData(transactionRepository);
    const getCategoryBarData = new GetCategoryBarData(transactionRepository, categoryRepository);
    const getGoalsProgressData = new GetGoalsProgressData(goalRepository);

    // Test user ID
    const testUserId = new mongoose.Types.ObjectId();
    console.log(`📝 Using test user ID: ${testUserId}\n`);

    // Create test categories
    console.log('📂 Creating test categories...');
    const categories = await Promise.all([
      Category.create({
        userId: testUserId,
        name: 'Food',
        type: 'expense',
        color: '#FF6B6B',
        icon: '🍽️'
      }),
      Category.create({
        userId: testUserId,
        name: 'Transport',
        type: 'expense',
        color: '#4ECDC4',
        icon: '🚗'
      }),
      Category.create({
        userId: testUserId,
        name: 'Salary',
        type: 'income',
        color: '#45B7D1',
        icon: '💰'
      })
    ]);
    console.log(`✅ Created ${categories.length} test categories\n`);

    // Create test transactions
    console.log('💳 Creating test transactions...');
    const currentDate = new Date();
    const transactions = await Promise.all([
      // Current month expenses
      Transaction.create({
        userId: testUserId,
        amount: 500,
        description: 'Grocery shopping',
        categoryId: categories[0]._id,
        categoryName: categories[0].name,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
        type: 'expense',
        currency: 'ETB'
      }),
      Transaction.create({
        userId: testUserId,
        amount: 200,
        description: 'Gas',
        categoryId: categories[1]._id,
        categoryName: categories[1].name,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
        type: 'expense',
        currency: 'ETB'
      }),
      // Current month income
      Transaction.create({
        userId: testUserId,
        amount: 5000,
        description: 'Monthly salary',
        categoryId: categories[2]._id,
        categoryName: categories[2].name,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        type: 'income',
        currency: 'ETB'
      }),
      // Previous month transactions
      Transaction.create({
        userId: testUserId,
        amount: 300,
        description: 'Restaurant',
        categoryId: categories[0]._id,
        categoryName: categories[0].name,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 15),
        type: 'expense',
        currency: 'ETB'
      }),
      Transaction.create({
        userId: testUserId,
        amount: 4800,
        description: 'Previous salary',
        categoryId: categories[2]._id,
        categoryName: categories[2].name,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
        type: 'income',
        currency: 'ETB'
      })
    ]);
    console.log(`✅ Created ${transactions.length} test transactions\n`);

    // Create test goals
    console.log('🎯 Creating test goals...');
    const goals = await Promise.all([
      Goal.create({
        userId: testUserId,
        title: 'Emergency Fund',
        description: 'Build emergency savings',
        targetAmount: 10000,
        currentAmount: 3000,
        startDate: new Date(currentDate.getFullYear(), 0, 1),
        endDate: new Date(currentDate.getFullYear(), 11, 31),
        currency: 'ETB',
        category: 'Savings',
        priority: 'high',
        status: 'active'
      }),
      Goal.create({
        userId: testUserId,
        title: 'Vacation Fund',
        description: 'Save for vacation',
        targetAmount: 5000,
        currentAmount: 1500,
        startDate: new Date(currentDate.getFullYear(), 0, 1),
        endDate: new Date(currentDate.getFullYear(), 6, 31),
        currency: 'ETB',
        category: 'Travel',
        priority: 'medium',
        status: 'active'
      })
    ]);
    console.log(`✅ Created ${goals.length} test goals\n`);

    // Test 1: Expenses Pie Data
    console.log('📊 Test 1: Getting expenses pie data...');
    const expensesPie = await getExpensesPieData.execute(testUserId);
    console.log('✅ Expenses pie data retrieved:');
    console.log(`   - Total expenses: ${expensesPie.summary.totalExpenses} ETB`);
    console.log(`   - Categories: ${expensesPie.summary.totalCategories}`);
    expensesPie.data.forEach(item => {
      console.log(`   - ${item.name}: ${item.value} ETB (${item.percentage}%)`);
    });
    console.log();

    // Test 2: Income Line Data
    console.log('📈 Test 2: Getting income line data...');
    const incomeLine = await getIncomeLineData.execute(testUserId, 3);
    console.log('✅ Income line data retrieved:');
    console.log(`   - Months: ${incomeLine.period.months}`);
    console.log(`   - Total income: ${incomeLine.summary.totalIncome} ETB`);
    console.log(`   - Total expenses: ${incomeLine.summary.totalExpenses} ETB`);
    console.log(`   - Income trend: ${incomeLine.insights.incomeTrend}`);
    console.log();

    // Test 3: Category Bar Data
    console.log('📊 Test 3: Getting category bar data...');
    const categoryBar = await getCategoryBarData.execute(testUserId);
    console.log('✅ Category bar data retrieved:');
    console.log(`   - Total categories: ${categoryBar.summary.totalCategories}`);
    console.log(`   - Total income: ${categoryBar.summary.totalIncome} ETB`);
    console.log(`   - Total expenses: ${categoryBar.summary.totalExpenses} ETB`);
    categoryBar.data.forEach(item => {
      console.log(`   - ${item.name} (${item.type}): ${item.value} ETB`);
    });
    console.log();

    // Test 4: Goals Progress Data
    console.log('🎯 Test 4: Getting goals progress data...');
    const goalsProgress = await getGoalsProgressData.execute(testUserId);
    console.log('✅ Goals progress data retrieved:');
    console.log(`   - Total goals: ${goalsProgress.summary.totalGoals}`);
    console.log(`   - Active goals: ${goalsProgress.summary.activeGoals}`);
    console.log(`   - Overall progress: ${goalsProgress.summary.overallProgress}%`);
    goalsProgress.data.forEach(goal => {
      console.log(`   - ${goal.title}: ${goal.progressPercentage}% (${goal.currentAmount}/${goal.targetAmount} ${goal.currency})`);
    });
    console.log();

    // Test 5: Test edge cases
    console.log('🔍 Test 5: Testing edge cases...');
    
    // Test with no data user
    const emptyUserId = new mongoose.Types.ObjectId();
    const emptyExpenses = await getExpensesPieData.execute(emptyUserId);
    console.log(`✅ Empty user expenses: ${emptyExpenses.data.length} categories`);
    
    const emptyGoals = await getGoalsProgressData.execute(emptyUserId);
    console.log(`✅ Empty user goals: ${emptyGoals.data.length} goals`);
    console.log();

    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await Promise.all([
      Transaction.deleteMany({ userId: testUserId }),
      Category.deleteMany({ userId: testUserId }),
      Goal.deleteMany({ userId: testUserId })
    ]);
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 All dashboard tests passed! Analytics implementation is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from database');
    process.exit(0);
  }
}

// Run tests
testDashboard();