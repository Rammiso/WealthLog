const mongoose = require('mongoose');
const config = require('../../config/env');
const { logger } = require('../../utils/logger');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
  }

  async connect() {
    try {
      // Mongoose connection options
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
      };

      // Add authentication if provided
      if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
        options.auth = {
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD
        };
      }

      logger.info('🔌 Connecting to MongoDB...');
      
      await mongoose.connect(config.MONGODB_URI, options);
      
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      logger.info('✅ MongoDB connected successfully');
      logger.info(`📊 Database: ${config.DB_NAME}`);
      logger.info(`🌐 Host: ${mongoose.connection.host}`);
      
    } catch (error) {
      this.isConnected = false;
      this.connectionAttempts++;
      
      logger.error('❌ MongoDB connection failed:', {
        error: error.message,
        attempt: this.connectionAttempts,
        maxRetries: this.maxRetries
      });

      // Retry connection if under max attempts
      if (this.connectionAttempts < this.maxRetries) {
        logger.info(`🔄 Retrying connection in ${this.retryDelay / 1000} seconds...`);
        setTimeout(() => this.connect(), this.retryDelay);
      } else {
        logger.error('💥 Max connection attempts reached. Exiting...');
        process.exit(1);
      }
    }
  }

  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.connection.close();
        this.isConnected = false;
        logger.info('🔌 MongoDB disconnected successfully');
      }
    } catch (error) {
      logger.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

// Connection event handlers
mongoose.connection.on('connected', () => {
  logger.info('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  logger.error('🔴 Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('🟡 Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
  await dbConnection.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await dbConnection.disconnect();
  process.exit(0);
});

module.exports = dbConnection;