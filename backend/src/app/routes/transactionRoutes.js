const express = require('express');
const { transactionController } = require('../controllers');
const { authenticate } = require('../middlewares');
const { transactionValidators } = require('../validators');

const router = express.Router();

/**
 * Transaction Routes
 * All routes are prefixed with /api/v1/transactions
 * All routes require authentication
 */

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/v1/transactions/recent - Get recent transactions
router.get('/recent', 
  transactionValidators.validateRecentTransactions,
  transactionController.getRecent
);

// GET /api/v1/transactions/search - Search transactions
router.get('/search', 
  transactionValidators.validateSearchTransactions,
  transactionController.search
);

// GET /api/v1/transactions/summary - Get transaction summary
router.get('/summary', 
  transactionValidators.validateSummaryQuery,
  transactionController.getSummary
);

// GET /api/v1/transactions/spending-by-category - Get spending by category
router.get('/spending-by-category', 
  transactionValidators.validateSummaryQuery,
  transactionController.getSpendingByCategory
);

// DELETE /api/v1/transactions/bulk - Bulk delete transactions
router.delete('/bulk', 
  transactionValidators.validateBulkDelete,
  transactionController.bulkDelete
);

// GET /api/v1/transactions - Get all user transactions
router.get('/', 
  transactionValidators.validateGetTransactions,
  transactionController.getAll
);

// POST /api/v1/transactions - Create new transaction
router.post('/', 
  transactionValidators.validateCreateTransaction,
  transactionController.create
);

// GET /api/v1/transactions/:id - Get transaction by ID
router.get('/:id', 
  transactionValidators.validateTransactionId,
  transactionController.getById
);

// PUT /api/v1/transactions/:id - Update transaction
router.put('/:id', 
  transactionValidators.validateUpdateTransaction,
  transactionController.update
);

// DELETE /api/v1/transactions/:id - Delete transaction
router.delete('/:id', 
  transactionValidators.validateTransactionId,
  transactionController.delete
);

// PATCH /api/v1/transactions/:id/restore - Restore deleted transaction
router.patch('/:id/restore', 
  transactionValidators.validateTransactionId,
  transactionController.restore
);

module.exports = router;