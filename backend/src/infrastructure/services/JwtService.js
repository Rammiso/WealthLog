const jwt = require('jsonwebtoken');
const config = require('../../config/env');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * JWT Service
 * Handles JWT token generation, verification, and management
 * Isolated from business logic for clean architecture
 */

class JwtService {
  constructor() {
    this.accessTokenSecret = config.JWT_SECRET;
    this.accessTokenExpiry = config.JWT_EXPIRES_IN;
    this.refreshTokenSecret = config.JWT_REFRESH_SECRET;
    this.refreshTokenExpiry = config.JWT_REFRESH_EXPIRES_IN;
  }

  /**
   * Generate access token
   */
  generateAccessToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.userId,
        email: payload.email,
        type: 'access'
      };

      const token = jwt.sign(
        tokenPayload,
        this.accessTokenSecret,
        {
          expiresIn: this.accessTokenExpiry,
          issuer: 'wealthlog-api',
          audience: 'wealthlog-client'
        }
      );

      logger.info('Access token generated', { userId: payload.userId });
      return token;
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw ApiError.internal('Failed to generate access token');
    }
  }

  /**
   * Generate refresh token (for future implementation)
   */
  generateRefreshToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.userId,
        email: payload.email,
        type: 'refresh'
      };

      const token = jwt.sign(
        tokenPayload,
        this.refreshTokenSecret,
        {
          expiresIn: this.refreshTokenExpiry,
          issuer: 'wealthlog-api',
          audience: 'wealthlog-client'
        }
      );

      logger.info('Refresh token generated', { userId: payload.userId });
      return token;
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw ApiError.internal('Failed to generate refresh token');
    }
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'wealthlog-api',
        audience: 'wealthlog-client'
      });

      // Ensure it's an access token
      if (decoded.type !== 'access') {
        throw ApiError.unauthorized('Invalid token type');
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        iat: decoded.iat,
        exp: decoded.exp
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Token has expired');
      }

      if (error.name === 'JsonWebTokenError') {
        throw ApiError.unauthorized('Invalid token');
      }

      if (error.name === 'NotBeforeError') {
        throw ApiError.unauthorized('Token not active yet');
      }

      logger.error('Error verifying access token:', error);
      throw ApiError.unauthorized('Token verification failed');
    }
  }

  /**
   * Verify refresh token (for future implementation)
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'wealthlog-api',
        audience: 'wealthlog-client'
      });

      // Ensure it's a refresh token
      if (decoded.type !== 'refresh') {
        throw ApiError.unauthorized('Invalid token type');
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        iat: decoded.iat,
        exp: decoded.exp
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Refresh token has expired');
      }

      if (error.name === 'JsonWebTokenError') {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      logger.error('Error verifying refresh token:', error);
      throw ApiError.unauthorized('Refresh token verification failed');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      logger.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      logger.error('Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token) {
    try {
      const expiration = this.getTokenExpiration(token);
      return expiration ? expiration < new Date() : true;
    } catch (error) {
      return true;
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  generateTokenPair(payload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresIn: this.accessTokenExpiry
    };
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

// Create singleton instance
const jwtService = new JwtService();

module.exports = jwtService;