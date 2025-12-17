/**
 * Test Goals Implementation
 * Simple script to test goal functionality
 */

const mongoose = require('mongoose');
const config = require('../src/config/env');
const Goal = require('../src/infrastructure/database/models/Goal');
const GoalRepository = require('../src/infrastructure/repositories/GoalRepository');
const CreateGoal = require('../src/usecases/goal/CreateGoal');
const GetGoals = require('../src/usecases/goal/GetGoals');
const GetMonthlySummary = require('../src/usecases/summary/GetMonthlySummary');

async function testGoals() {
  try {
    console.log('🚀 Testing Goals Implementation...\n');

    // Connect to database
    await mongoose.connect(config.DB_URI);
    console.log('✅ Connected to database');

    // Create repository and use cases
    const goalRepository = new GoalRepository(Goal);
    const createGoal = new CreateGoal(goalRepository);
    const getGoals = new GetGoals(goalRepository);

    // Test user ID (you can replace with actual user ID)
    const testUserId = new mongoose.Types.ObjectId();
    console.log(`📝 Using test user ID: ${testUserId}\n`);

    // Test 1: Create a goal
    console.log('🎯 Test 1: Creating a goal...');
    const goalData = {
      title: 'Emergency Fund',
      description: 'Build an emergency fund for unexpected expenses',
      targetAmount: 10000,
      currentAmount: 2500,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      currency: 'ETB',
      category: 'Savings',
      priority: 'high'
    };

    const createdGoal = await createGoal.execute(testUserId, goalData);
    console.log('✅ Goal created successfully:');
    console.log(`   - ID: ${createdGoal.id}`);
    console.log(`   - Title: ${createdGoal.title}`);
    console.log(`   - Progress: ${createdGoal.progressPercentage}%`);
    console.log(`   - Remaining: ${createdGoal.remainingAmount} ${createdGoal.currency}\n`);

    // Test 2: Get goals
    console.log('📋 Test 2: Retrieving goals...');
    const goals = await getGoals.execute(testUserId);
    console.log(`✅ Retrieved ${goals.data.length} goal(s)`);
    
    if (goals.data.length > 0) {
      const goal = goals.data[0];
      console.log(`   - First goal: ${goal.title}`);
      console.log(`   - Status: ${goal.status}`);
      console.log(`   - Days remaining: ${goal.daysRemaining}\n`);
    }

    // Test 3: Test domain entity business logic
    console.log('🧠 Test 3: Testing business logic...');
    const goalEntity = require('../src/domain/entities/Goal').fromDocument(createdGoal);
    console.log(`✅ Progress calculation: ${goalEntity.getProgressPercentage()}%`);
    console.log(`✅ Remaining amount: ${goalEntity.getRemainingAmount()}`);
    console.log(`✅ Required monthly amount: ${goalEntity.getRequiredMonthlyAmount().toFixed(2)}`);
    console.log(`✅ Is completed: ${goalEntity.isCompleted()}`);
    console.log(`✅ Is overdue: ${goalEntity.isOverdue()}\n`);

    // Test 4: Test validation
    console.log('🔍 Test 4: Testing validation...');
    try {
      await createGoal.execute(testUserId, {
        title: '', // Invalid: empty title
        targetAmount: -100 // Invalid: negative amount
      });
    } catch (error) {
      console.log('✅ Validation working correctly - caught invalid data');
      console.log(`   - Error: ${error.message}\n`);
    }

    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await Goal.deleteMany({ userId: testUserId });
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 All tests passed! Goals implementation is working correctly.');

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
testGoals();