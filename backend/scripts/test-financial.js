#!/usr/bin/env node

/**
 * Financial Features Test Script
 * Tests categories and transactions CRUD operations
 */

const http = require('http');
const config = require('../src/config/env');

const API_BASE = `http://localhost:${config.PORT}${config.API_PREFIX}/${config.API_VERSION}`;

// Test data
const testUser = {
  firstName: 'Financial',
  lastName: 'Tester',
  email: `financial.test.${Date.now()}@example.com`,
  password: 'TestPassword123!',
  currency: 'ETB'
};

let authToken = null;
let testCategoryId = null;
let testTransactionId = null;

console.log('🧪 Testing WealthLog Financial Features...\n');

// Helper function to make HTTP requests
const makeRequest = (method, path, data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: config.PORT,
      path: `${config.API_PREFIX}/${config.API_VERSION}${path}`,
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: response,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: responseData,
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

// Setup: Register and login user
const setupTestUser = async () => {
  console.log('0. Setting up test user...');
  
  try {
    // Register user
    const registerResponse = await makeRequest('POST', '/auth/register', testUser);
    if (!registerResponse.success) {
      throw new Error('Failed to register test user');
    }
    
    authToken = registerResponse.data.data.tokens.accessToken;
    console.log('✅ Test user registered and authenticated');
    return true;
  } catch (error) {
    console.log('❌ Test user setup failed:', error.message);
    return false;
  }
};

// Test category creation
const testCreateCategory = async () => {
  console.log('\n1. Testing category creation...');
  
  try {
    const categoryData = {
      name: 'Test Income Category',
      type: 'income',
      color: '#4CAF50',
      icon: 'briefcase'
    };
    
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const response = await makeRequest('POST', '/categories', categoryData, headers);
    
    if (response.success && response.data.data.id) {
      testCategoryId = response.data.data.id;
      console.log('✅ Category created successfully');
      console.log(`   Category ID: ${response.data.data.id}`);
      console.log(`   Name: ${response.data.data.name}`);
      console.log(`   Type: ${response.data.data.type}`);
      return true;
    } else {
      console.log('❌ Category creation failed');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Category creation error:', error.message);
    return false;
  }
};

// Test get categories
const testGetCategories = async () => {
  console.log('\n2. Testing get categories...');
  
  try {
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const response = await makeRequest('GET', '/categories', null, headers);
    
    if (response.success && Array.isArray(response.data.data)) {
      console.log('✅ Categories retrieved successfully');
      console.log(`   Total categories: ${response.data.data.length}`);
      
      // Check if our test category is in the list
      const testCategory = response.data.data.find(cat => cat.id === testCategoryId);
      if (testCategory) {
        console.log(`   Test category found: ${testCategory.name}`);
      }
      
      return true;
    } else {
      console.log('❌ Get categories failed');
      console.log(`   Status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Get categories error:', error.message);
    return false;
  }
};

// Test transaction creation
const testCreateTransaction = async () => {
  console.log('\n3. Testing transaction creation...');
  
  if (!testCategoryId) {
    console.log('❌ No test category available for transaction');
    return false;
  }
  
  try {
    const transactionData = {
      amount: 5000.50,
      description: 'Test salary payment',
      notes: 'Monthly salary for testing',
      categoryId: testCategoryId,
      date: new Date().toISOString(),
      type: 'income',
      currency: 'ETB'
    };
    
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const response = await makeRequest('POST', '/transactions', transactionData, headers);
    
    if (response.success && response.data.data.id) {
      testTransactionId = response.data.data.id;
      console.log('✅ Transaction created successfully');
      console.log(`   Transaction ID: ${response.data.data.id}`);
      console.log(`   Amount: ${response.data.data.formattedAmount}`);
      console.log(`   Type: ${response.data.data.type}`);
      console.log(`   Category: ${response.data.data.categoryName}`);
      return true;
    } else {
      console.log('❌ Transaction creation failed');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Transaction creation error:', error.message);
    return false;
  }
};

// Test get transactions
const testGetTransactions = async () => {
  console.log('\n4. Testing get transactions...');
  
  try {
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const response = await makeRequest('GET', '/transactions', null, headers);
    
    if (response.success && response.data.data.transactions) {
      console.log('✅ Transactions retrieved successfully');
      console.log(`   Total transactions: ${response.data.data.transactions.length}`);
      console.log(`   Current page: ${response.data.data.pagination.page}`);
      console.log(`   Total pages: ${response.data.data.pagination.totalPages}`);
      
      // Check if our test transaction is in the list
      const testTransaction = response.data.data.transactions.find(tx => tx.id === testTransactionId);
      if (testTransaction) {
        console.log(`   Test transaction found: ${testTransaction.description}`);
      }
      
      return true;
    } else {
      console.log('❌ Get transactions failed');
      console.log(`   Status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Get transactions error:', error.message);
    return false;
  }
};

// Test transaction update
const testUpdateTransaction = async () => {
  console.log('\n5. Testing transaction update...');
  
  if (!testTransactionId) {
    console.log('❌ No test transaction available for update');
    return false;
  }
  
  try {
    const updateData = {
      amount: 6000.00,
      description: 'Updated test salary payment',
      notes: 'Updated monthly salary for testing'
    };
    
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const response = await makeRequest('PUT', `/transactions/${testTransactionId}`, updateData, headers);
    
    if (response.success && response.data.data.id) {
      console.log('✅ Transaction updated successfully');
      console.log(`   New amount: ${response.data.data.formattedAmount}`);
      console.log(`   New description: ${response.data.data.description}`);
      return true;
    } else {
      console.log('❌ Transaction update failed');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Transaction update error:', error.message);
    return false;
  }
};

// Test transaction summary
const testTransactionSummary = async () => {
  console.log('\n6. Testing transaction summary...');
  
  try {
    const headers = { 'Authorization': `Bearer ${authToken}` };
    const response = await makeRequest('GET', '/transactions/summary?period=month', null, headers);
    
    if (response.success && response.data.data) {
      console.log('✅ Transaction summary retrieved successfully');
      console.log(`   Period: ${response.data.data.period}`);
      console.log(`   Income total: ${response.data.data.income.total} ETB`);
      console.log(`   Expense total: ${response.data.data.expense.total} ETB`);
      console.log(`   Net income: ${response.data.data.netIncome} ETB`);
      return true;
    } else {
      console.log('❌ Transaction summary failed');
      console.log(`   Status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Transaction summary error:', error.message);
    return false;
  }
};

// Test search functionality
const testSearch = async () => {
  console.log('\n7. Testing search functionality...');
  
  try {
    const headers = { 'Authorization': `Bearer ${authToken}` };
    
    // Search transactions
    const transactionSearchResponse = await makeRequest('GET', '/transactions/search?q=salary', null, headers);
    
    if (transactionSearchResponse.success) {
      console.log('✅ Transaction search successful');
      console.log(`   Found ${transactionSearchResponse.data.data.transactions.length} transactions`);
    } else {
      console.log('❌ Transaction search failed');
      return false;
    }
    
    // Search categories
    const categorySearchResponse = await makeRequest('GET', '/categories/search?q=test', null, headers);
    
    if (categorySearchResponse.success) {
      console.log('✅ Category search successful');
      console.log(`   Found ${categorySearchResponse.data.data.length} categories`);
      return true;
    } else {
      console.log('❌ Category search failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Search functionality error:', error.message);
    return false;
  }
};

// Test unauthorized access
const testUnauthorizedAccess = async () => {
  console.log('\n8. Testing unauthorized access (security check)...');
  
  try {
    const response = await makeRequest('GET', '/categories');
    
    if (!response.success && response.statusCode === 401) {
      console.log('✅ Unauthorized access properly blocked');
      return true;
    } else {
      console.log('❌ Unauthorized access was not properly blocked');
      console.log(`   Status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Unauthorized access test error:', error.message);
    return false;
  }
};

// Cleanup: Delete test data
const cleanupTestData = async () => {
  console.log('\n9. Cleaning up test data...');
  
  try {
    const headers = { 'Authorization': `Bearer ${authToken}` };
    let cleanupSuccess = true;
    
    // Delete test transaction
    if (testTransactionId) {
      const deleteTransactionResponse = await makeRequest('DELETE', `/transactions/${testTransactionId}`, null, headers);
      if (deleteTransactionResponse.success) {
        console.log('✅ Test transaction deleted');
      } else {
        console.log('⚠️  Failed to delete test transaction');
        cleanupSuccess = false;
      }
    }
    
    // Delete test category
    if (testCategoryId) {
      const deleteCategoryResponse = await makeRequest('DELETE', `/categories/${testCategoryId}`, null, headers);
      if (deleteCategoryResponse.success) {
        console.log('✅ Test category deleted');
      } else {
        console.log('⚠️  Failed to delete test category');
        cleanupSuccess = false;
      }
    }
    
    return cleanupSuccess;
  } catch (error) {
    console.log('❌ Cleanup error:', error.message);
    return false;
  }
};

// Run all tests
const runFinancialTests = async () => {
  const tests = [
    setupTestUser,
    testCreateCategory,
    testGetCategories,
    testCreateTransaction,
    testGetTransactions,
    testUpdateTransaction,
    testTransactionSummary,
    testSearch,
    testUnauthorizedAccess,
    cleanupTestData
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
    }
  }

  console.log(`\n📊 Financial Features Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All financial tests passed! System is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️  Some financial tests failed. Please check the system.');
    process.exit(1);
  }
};

// Wait for server to be ready, then run tests
setTimeout(runFinancialTests, 3000);