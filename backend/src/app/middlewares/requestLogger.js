const morgan = require('morgan');
const { stream } = require('../../utils/logger');
const config = require('../../config/env');

// Custom token for response time in milliseconds
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

// Custom format for development
const devFormat = ':method :url :status :res[content-length] - :response-time ms';

// Custom format for production
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

const requestLogger = morgan(
  config.isDevelopment() ? devFormat : prodFormat,
  {
    stream,
    skip: (req, res) => {
      // Skip logging for health check in production
      if (config.isProduction() && req.url === '/health') {
        return true;
      }
      return false;
    }
  }
);

module.exports = requestLogger;