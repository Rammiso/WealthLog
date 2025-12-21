#!/usr/bin/env node

/**
 * Create Sample Data Script
 * Adds sample categories, transactions, and goals for testing
 */

const mongoose = require('mongoose');
const config = require('../src/config/env');
const { logger } = require('../src/utils/logger');

// Import models
const User = require('../src/infrastructure/database/models/User');
const Category = require('../src/infrastructure/database/models/Category');
const Transaction = require('../src/infrastructure/database/models/Transaction');
const Goal = require('../src/infrastructure/database/models/Goal');

async function createSampleData() {
  try {
    // Connect to database
    await mongoose.connect(config.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Find the first user (or create one)
    let user = await User.findOne({ email: 'mushas1248@gmail.com' });
    
    if (!user) {
      console.log('No user found. Please register a user first at /auth/register');
      process.exit(1);
    }

    console.log(`Creating sample data for user: ${user.email}`);

    // Create sample categories
    const categories = [
      { name: 'Food & Dining', type: 'expense', color: '#FF6B6B', icon: '🍽️' },
      { name: 'Transportation', type: 'expense', color: '#4ECDC4', icon: '🚗' },
      { name: 'Entertainment', type: 'expense', color: '#45B7D1', icon: '🎬' },
      { name: 'Shopping', type: 'expense', color: '#96CEB4', icon: '🛍️' },
      { name: 'Utilities', type: 'expense', color: '#FFEAA7', icon: '💡' },
      { name: 'Salary', type: 'income', color: '#00B894', icon: '💰' },
      { name: 'Freelance', type: 'income', color: '#00CEC9', icon: '💻' },
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ 
        name: categoryData.name, 
        userId: user._id 
      });
      
      if (!existingCategory) {
        const category = new Category({
          ...categoryData,
          userId: user._id
        });
        await category.save();
        createdCategories.push(category);
        console.log(`Created category: ${category.name}`);
      } else {
        createdCategories.push(existingCategory);
        console.log(`Category already exists: ${existingCategory.name}`);
      }
    }

    // Create sample transactions for the last 3 months
    const transactions = [];
    const now = new Date();
    
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const month = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      
      // Income transactions
      const salaryCategory = createdCategories.find(c => c.name === 'Salary');
      if (salaryCategory) {
        transactions.push({
          amount: 15000,
          description: 'Monthly Salary',
          type: 'income',
          categoryId: salaryCategory._id,
          categoryName: salaryCategory.name,
          date: new Date(month.getFullYear(), month.getMonth(), 1),
          currency: 'ETB',
          userId: user._id
        });
      }

      // Expense transactions
      const expenseData = [
        { category: 'Food & Dining', amount: 2500, description: 'Grocery shopping' },
        { category: 'Food & Dining', amount: 800, description: 'Restaurant dinner' },
        { category: 'Transportation', amount: 1200, description: 'Fuel and maintenance' },
        { category: 'Entertainment', amount: 600, description: 'Movie tickets' },
        { category: 'Shopping', amount: 1800, description: 'Clothing and accessories' },
        { category: 'Utilities', amount: 2200, description: 'Electricity and water' },
      ];

      for (const expense of expenseData) {
        const category = createdCategories.find(c => c.name === expense.category);
        if (category) {
          transactions.push({
            amount: expense.amount,
            description: expense.description,
            type: 'expense',
            categoryId: category._id,
            categoryName: category.name,
            date: new Date(month.getFullYear(), month.getMonth(), Math.floor(Math.random() * 28) + 1),
            currency: 'ETB',
            userId: user._id
          });
        }
      }
    }

    // Create transactions
    for (const transactionData of transactions) {
      const existingTransaction = await Transaction.findOne({
        description: transactionData.description,
        amount: transactionData.amount,
        userId: user._id,
        date: transactionData.date
      });

      if (!existingTransaction) {
        const transaction = new Transaction(transactionData);
        await transaction.save();
        console.log(`Created transaction: ${transaction.description} - ${transaction.amount} ETB`);
      }
    }

    // Create sample goals
    const goals = [
      {
        title: 'Emergency Fund',
        description: 'Save 6 months of expenses',
        targetAmount: 50000,
        currentAmount: 15000,
        endDate: new Date(now.getFullYear(), now.getMonth() + 6, 1),
        currency: 'ETB',
        priority: 'high',
        userId: user._id
      },
      {
        title: 'Vacation Fund',
        description: 'Save for a trip to Europe',
        targetAmount: 25000,
        currentAmount: 8000,
        endDate: new Date(now.getFullYear() + 1, 5, 1),
        currency: 'ETB',
        priority: 'medium',
        userId: user._id
      },
      {
        title: 'New Laptop',
        description: 'Save for a new MacBook Pro',
        targetAmount: 12000,
        currentAmount: 4500,
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, 1),
        currency: 'ETB',
        priority: 'low',
        userId: user._id
      }
    ];

    for (const goalData of goals) {
      const existingGoal = await Goal.findOne({
        title: goalData.title,
        userId: user._id
      });

      if (!existingGoal) {
        const goal = new Goal(goalData);
        await goal.save();
        console.log(`Created goal: ${goal.title} - ${goal.currentAmount}/${goal.targetAmount} ETB`);
      } else {
        console.log(`Goal already exists: ${existingGoal.title}`);
      }
    }

    console.log('\n✅ Sample data created successfully!');
    console.log('You can now test the dashboard endpoints.');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the script
createSampleData();