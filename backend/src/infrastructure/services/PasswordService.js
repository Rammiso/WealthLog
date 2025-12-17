const bcrypt = require('bcryptjs');
const config = require('../../config/env');
const ApiError = require('../../utils/ApiError');
const { logger } = require('../../utils/logger');

/**
 * Password Service
 * Handles password hashing, comparison, and validation
 * Isolated service for clean architecture
 */

class PasswordService {
  constructor() {
    this.saltRounds = config.BCRYPT_SALT_ROUNDS;
  }

  /**
   * Hash password
   */
  async hashPassword(plainPassword) {
    try {
      if (!plainPassword) {
        throw ApiError.badRequest('Password is required');
      }

      // Validate password strength
      this.validatePasswordStrength(plainPassword);

      const hashedPassword = await bcrypt.hash(plainPassword, this.saltRounds);
      
      logger.info('Password hashed successfully');
      return hashedPassword;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error('Error hashing password:', error);
      throw ApiError.internal('Failed to hash password');
    }
  }

  /**
   * Compare password with hash
   */
  async comparePassword(plainPassword, hashedPassword) {
    try {
      if (!plainPassword || !hashedPassword) {
        return false;
      }

      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      
      logger.info('Password comparison completed', { isMatch });
      return isMatch;
    } catch (error) {
      logger.error('Error comparing password:', error);
      return false;
    }
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    const errors = [];

    // Minimum length
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Maximum length (prevent DoS attacks)
    if (password && password.length > 128) {
      errors.push('Password cannot exceed 128 characters');
    }

    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // At least one number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // At least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Common password patterns
    const commonPatterns = [
      /^password/i,
      /^123456/,
      /^qwerty/i,
      /^admin/i,
      /^welcome/i
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
      errors.push('Password is too common, please choose a stronger password');
    }

    if (errors.length > 0) {
      throw ApiError.validation('Password does not meet security requirements', errors);
    }

    return true;
  }

  /**
   * Generate password strength score (0-100)
   */
  calculatePasswordStrength(password) {
    if (!password) return 0;

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      longLength: password.length >= 12,
      veryLongLength: password.length >= 16
    };

    // Base requirements (60 points total)
    if (checks.length) score += 15;
    if (checks.lowercase) score += 10;
    if (checks.uppercase) score += 10;
    if (checks.numbers) score += 15;
    if (checks.symbols) score += 10;

    // Bonus points (40 points total)
    if (checks.longLength) score += 15;
    if (checks.veryLongLength) score += 10;

    // Variety bonus
    const variety = Object.values(checks).filter(Boolean).length;
    if (variety >= 5) score += 10;
    if (variety >= 6) score += 5;

    return Math.min(score, 100);
  }

  /**
   * Get password strength description
   */
  getPasswordStrengthDescription(score) {
    if (score < 30) return 'Very Weak';
    if (score < 50) return 'Weak';
    if (score < 70) return 'Fair';
    if (score < 85) return 'Good';
    return 'Strong';
  }

  /**
   * Generate secure random password
   */
  generateSecurePassword(length = 16) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Check if password needs rehashing (if salt rounds changed)
   */
  async needsRehash(hashedPassword) {
    try {
      // Extract current rounds from hash
      const rounds = parseInt(hashedPassword.split('$')[2]);
      return rounds !== this.saltRounds;
    } catch (error) {
      logger.error('Error checking if password needs rehash:', error);
      return false;
    }
  }
}

// Create singleton instance
const passwordService = new PasswordService();

module.exports = passwordService;