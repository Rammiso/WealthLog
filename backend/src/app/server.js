const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const config = require('../config/env');
const { logger } = require('../utils/logger');
const { errorHandler, notFound, requestLogger } = require('./middlewares');
const routes = require('./routes');
const dbConnection = require('../infrastructure/database/connection');

// Create Express application
const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.isProduction() ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      config.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (allowedOrigins.includes(origin) || config.isDevelopment()) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  strict: true
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Response time middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    // res.setHeader('X-Response-Time', duration);
    console.log(`Response time: ${duration}ms`);
  });
  
  next();
});

// API routes
app.use(`${config.API_PREFIX}/${config.API_VERSION}`, routes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'WealthLog API Server',
    version: config.API_VERSION,
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler - must be last
app.use(errorHandler);



// Initialize database connection and start server
const startServer = async () => {
  try {
    // Connect to database first
    await dbConnection.connect();
    
    // Start server after successful database connection
    const server = app.listen(config.PORT, () => {
      logger.info(`🚀 WealthLog API Server started successfully`);
      logger.info(`📍 Environment: ${config.NODE_ENV}`);
      logger.info(`🌐 Server running on port ${config.PORT}`);
      logger.info(`📡 API endpoint: http://localhost:${config.PORT}${config.API_PREFIX}/${config.API_VERSION}`);
      logger.info(`❤️  Health check: http://localhost:${config.PORT}${config.API_PREFIX}/${config.API_VERSION}/health`);
      
      if (config.isDevelopment()) {
        logger.info(`🔧 Development mode - Hot reload enabled`);
      }
    });

    return server;
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
const server = startServer();

// Handle server errors (wrap in promise to handle async server)
server.then(serverInstance => {
  serverInstance.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof config.PORT === 'string' 
      ? 'Pipe ' + config.PORT 
      : 'Port ' + config.PORT;

    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  // Graceful shutdown handling
  const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    try {
      // Close server first
      await new Promise((resolve, reject) => {
        serverInstance.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Disconnect from database
      await dbConnection.disconnect();
      
      logger.info('Server and database closed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  // Handle process signals for graceful shutdown
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}).catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});



// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;