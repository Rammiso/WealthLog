#!/usr/bin/env node

/**
 * Simple server test script
 * Tests basic endpoints to ensure server is working
 */

const http = require('http');
const config = require('../src/config/env');

const testEndpoints = [
  { path: '/', name: 'Root endpoint' },
  { path: `${config.API_PREFIX}/${config.API_VERSION}`, name: 'API root' },
  { path: `${config.API_PREFIX}/${config.API_VERSION}/health`, name: 'Health check' },
  { path: `${config.API_PREFIX}/${config.API_VERSION}/info`, name: 'API info' }
];

console.log('🧪 Testing WealthLog API Server...\n');

const testEndpoint = (endpoint) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: config.PORT,
      path: endpoint.path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            endpoint: endpoint.name,
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            response
          });
        } catch (error) {
          resolve({
            endpoint: endpoint.name,
            status: res.statusCode,
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({
        endpoint: endpoint.name,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        endpoint: endpoint.name,
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
};

const runTests = async () => {
  let passedTests = 0;
  let totalTests = testEndpoints.length;

  for (const endpoint of testEndpoints) {
    try {
      const result = await testEndpoint(endpoint);
      
      if (result.success) {
        console.log(`✅ ${result.endpoint} - Status: ${result.status}`);
        passedTests++;
      } else {
        console.log(`❌ ${result.endpoint} - Status: ${result.status}`);
      }
    } catch (error) {
      console.log(`❌ ${error.endpoint} - Error: ${error.error}`);
    }
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Server is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the server.');
    process.exit(1);
  }
};

// Wait a moment for server to start, then run tests
setTimeout(runTests, 2000);