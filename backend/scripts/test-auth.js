#!/usr/bin/env node

/**
 * Authentication System Test Script
 * Tests user registration, login, and protected routes
 */

const http = require('http');
const config = require('../src/config/env');

const API_BASE = `http://localhost:${config.PORT}${config.API_PREFIX}/${config.API_VERSION}`;

// Test data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: `test.user.${Date.now()}@example.com`,
  password: 'TestPassword123!',
  currency: 'ETB'
};

let authToken = null;

console.log('🧪 Testing WealthLog Authentication System...\n');

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

// Test functions
const testUserRegistration = async () => {
  console.log('1. Testing user registration...');
  
  try {
    const response = await makeRequest('POST', '/auth/register', testUser);
    
    if (response.success && response.data.data.user && response.data.data.tokens) {
      console.log('✅ User registration successful');
      console.log(`   User ID: ${response.data.data.user.id}`);
      console.log(`   Email: ${response.data.data.user.email}`);
      console.log(`   Full Name: ${response.data.data.user.fullName}`);
      
      // Store auth token for subsequent tests
      authToken = response.data.data.tokens.accessToken;
      return true;
    } else {
      console.log('❌ User registration failed');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ User registration error:', error.message);
    return false;
  }
};

const testUserLogin = async () => {
  console.log('\n2. Testing user login...');
  
  try {
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    
    const response = await makeRequest('POST', '/auth/login', loginData);
    
    if (response.success && response.data.data.user && response.data.data.tokens) {
      console.log('✅ User login successful');
      console.log(`   User ID: ${response.data.data.user.id}`);
      console.log(`   Last Login: ${response.data.data.user.lastLoginAt}`);
      
      // Update auth token
      authToken = response.data.data.tokens.accessToken;
      return true;
    } else {
      console.log('❌ User login failed');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ User login error:', error.message);
    return false;
  }
};

const testProtectedRoute = async () => {
  console.log('\n3. Testing protected route access...');
  
  if (!authToken) {
    console.log('❌ No auth token available');
    return false;
  }
  
  try {
    const headers = {
      'Authorization': `Bearer ${authToken}`
    };
    
    const response = await makeRequest('GET', '/auth/me', null, headers);
    
    if (response.success && response.data.data.id) {
      console.log('✅ Protected route access successful');
      console.log(`   User ID: ${response.data.data.id}`);
      console.log(`   Email: ${response.data.data.email}`);
      console.log(`   Profile Complete: ${response.data.data.profileComplete}`);
      return true;
    } else {
      console.log('❌ Protected route access failed');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Protected route error:', error.message);
    return false;
  }
};

const testAuthCheck = async () => {
  console.log('\n4. Testing authentication status check...');
  
  if (!authToken) {
    console.log('❌ No auth token available');
    return false;
  }
  
  try {
    const headers = {
      'Authorization': `Bearer ${authToken}`
    };
    
    const response = await makeRequest('GET', '/auth/check', null, headers);
    
    if (response.success && response.data.data.isAuthenticated) {
      console.log('✅ Authentication status check successful');
      console.log(`   Authenticated: ${response.data.data.isAuthenticated}`);
      console.log(`   Token expires: ${response.data.data.tokenInfo.expiresAt}`);
      return true;
    } else {
      console.log('❌ Authentication status check failed');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Authentication status check error:', error.message);
    return false;
  }
};

const testInvalidLogin = async () => {
  console.log('\n5. Testing invalid login (security check)...');
  
  try {
    const invalidLoginData = {
      email: testUser.email,
      password: 'WrongPassword123!'
    };
    
    const response = await makeRequest('POST', '/auth/login', invalidLoginData);
    
    if (!response.success && response.statusCode === 401) {
      console.log('✅ Invalid login properly rejected');
      console.log(`   Status: ${response.statusCode}`);
      return true;
    } else {
      console.log('❌ Invalid login was not properly rejected');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid login test error:', error.message);
    return false;
  }
};

const testUnauthorizedAccess = async () => {
  console.log('\n6. Testing unauthorized access (security check)...');
  
  try {
    const response = await makeRequest('GET', '/auth/me');
    
    if (!response.success && response.statusCode === 401) {
      console.log('✅ Unauthorized access properly blocked');
      console.log(`   Status: ${response.statusCode}`);
      return true;
    } else {
      console.log('❌ Unauthorized access was not properly blocked');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Unauthorized access test error:', error.message);
    return false;
  }
};

// Run all tests
const runAuthTests = async () => {
  const tests = [
    testUserRegistration,
    testUserLogin,
    testProtectedRoute,
    testAuthCheck,
    testInvalidLogin,
    testUnauthorizedAccess
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

  console.log(`\n📊 Authentication Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All authentication tests passed! System is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️  Some authentication tests failed. Please check the system.');
    process.exit(1);
  }
};

// Wait for server to be ready, then run tests
setTimeout(runAuthTests, 3000);