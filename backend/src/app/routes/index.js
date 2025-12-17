const express = require('express');
const ApiResponse = require('../../utils/ApiResponse');
const config = require('../../config/env');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const transactionRoutes = require('./transactionRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const dbConnection = require('../../infrastructure/database/connection');
  const dbStatus = dbConnection.getConnectionStatus();
  
  const healthData = {
    status: dbStatus.isConnected ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: {
        status: dbStatus.isConnected ? 'connected' : 'disconnected',
        host: dbStatus.host || 'unknown',
        name: dbStatus.name || config.DB_NAME,
        readyState: dbStatus.readyState
      }
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
    }
  };

  const message = dbStatus.isConnected ? 'Service is healthy' : 'Service is degraded - database connection issues';
  ApiResponse.success(healthData, message).send(res);
});

// API info endpoint
router.get('/info', (req, res) => {
  const apiInfo = {
    name: 'WealthLog API',
    version: process.env.npm_package_version || '1.0.0',
    description: 'Professional financial intelligence platform API',
    environment: config.NODE_ENV,
    apiVersion: config.API_VERSION,
    endpoints: {
      health: `${config.API_PREFIX}/health`,
      info: `${config.API_PREFIX}/info`
    }
  };

  ApiResponse.success(apiInfo, 'API information').send(res);
});

// Welcome message for API root
router.get('/', (req, res) => {
  const welcomeData = {
    message: 'Welcome to WealthLog API',
    version: config.API_VERSION,
    documentation: `${config.API_PREFIX}/info`,
    health: `${config.API_PREFIX}/health`
  };

  ApiResponse.success(welcomeData, 'WealthLog API is running').send(res);
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;