const express = require('express');
const { categoryController } = require('../controllers');
const { authenticate } = require('../middlewares');
const { categoryValidators } = require('../validators');

const router = express.Router();

/**
 * Category Routes
 * All routes are prefixed with /api/v1/categories
 * All routes require authentication
 */

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/v1/categories/stats - Get category statistics
router.get('/stats', categoryController.getStats);

// GET /api/v1/categories/search - Search categories
router.get('/search', 
  categoryValidators.validateSearchCategories,
  categoryController.search
);

// POST /api/v1/categories/defaults - Create default categories
router.post('/defaults', categoryController.createDefaults);

// GET /api/v1/categories - Get all user categories
router.get('/', 
  categoryValidators.validateGetCategories,
  categoryController.getAll
);

// POST /api/v1/categories - Create new category
router.post('/', 
  categoryValidators.validateCreateCategory,
  categoryController.create
);

// GET /api/v1/categories/:id - Get category by ID
router.get('/:id', 
  categoryValidators.validateCategoryId,
  categoryController.getById
);

// PUT /api/v1/categories/:id - Update category
router.put('/:id', 
  categoryValidators.validateUpdateCategory,
  categoryController.update
);

// DELETE /api/v1/categories/:id - Delete category
router.delete('/:id', 
  categoryValidators.validateCategoryId,
  categoryController.delete
);

// PATCH /api/v1/categories/:id/deactivate - Deactivate category
router.patch('/:id/deactivate', 
  categoryValidators.validateCategoryId,
  categoryController.deactivate
);

// PATCH /api/v1/categories/:id/reactivate - Reactivate category
router.patch('/:id/reactivate', 
  categoryValidators.validateCategoryId,
  categoryController.reactivate
);

module.exports = router;