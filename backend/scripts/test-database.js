#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests MongoDB connection and basic operations
 */

const dbConnection = require('../src/infrastructure/database/connection');
const { logger } = require('../src/utils/logger');

const testDatabase = async () => {
  console.log('🧪 Testing MongoDB Connection...\n');

  try {
    // Test connection
    console.log('1. Testing database connection...');
    await dbConnection.connect();
    
    const status = dbConnection.getConnectionStatus();
    console.log('✅ Database connection successful');
    console.log(`   Host: ${status.host}`);
    console.log(`   Database: ${status.name}`);
    console.log(`   Ready State: ${status.readyState}`);
    
    // Test basic operations (without models for now)
    console.log('\n2. Testing basic database operations...');
    const mongoose = require('mongoose');
    
    // Test database ping
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();
    console.log('✅ Database ping successful:', pingResult);
    
    // Test database stats
    const stats = await mongoose.connection.db.stats();
    console.log('✅ Database stats retrieved');
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${Math.round(stats.dataSize / 1024)} KB`);
    
    console.log('\n🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  } finally {
    // Cleanup
    await dbConnection.disconnect();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run tests
testDatabase();