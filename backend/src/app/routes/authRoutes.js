const express = require('express');
const { authController } = require('../controllers');
const { authenticate, authRateLimit } = require('../middlewares');
const { authValidators } = require('../validators');

const router = express.Router();

/**
 * Authentication Routes
 * All routes are prefixed with /api/v1/auth
 */

// Public routes (no authentication required)
router.post('/register', 
  authRateLimit, 
  authValidators.validateRegistration, 
  authController.register
);

router.post('/login', 
  authRateLimit, 
  authValidators.validateLogin, 
  authController.login
);

// Protected routes (authentication required)
router.use(authenticate); // Apply authentication middleware to all routes below

router.get('/me', authController.getProfile);
router.put('/profile', 
  authValidators.validateProfileUpdate, 
  authController.updateProfile
);
router.post('/logout', authController.logout);
router.get('/check', authController.checkAuth);

module.exports = router;