#!/usr/bin/env node

/**
 * WealthLog API Server Startup Script
 * Handles server initialization with proper error handling
 */

const config = require('../src/config/env');
const { logger } = require('../src/utils/logger');

// Display startup banner
console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                    🏦 WealthLog API Server                   ║
║                                                              ║
║              Professional Financial Intelligence             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

// Log startup information
logger.info('🚀 Starting WealthLog API Server...');
logger.info(`📍 Environment: ${config.NODE_ENV}`);
logger.info(`🌐 Port: ${config.PORT}`);
logger.info(`📊 Log Level: ${config.LOG_LEVEL}`);

// Check Node.js version
const nodeVersion = process.version;
const requiredVersion = '18.0.0';

if (parseInt(nodeVersion.slice(1)) < parseInt(requiredVersion)) {
  logger.error(`❌ Node.js version ${requiredVersion} or higher is required. Current version: ${nodeVersion}`);
  process.exit(1);
}

// Start the server
try {
  require('../src/app/server');
} catch (error) {
  logger.error('❌ Failed to start server:', error);
  process.exit(1);
}