const express = require('express');
const goalController = require('../controllers/goalController');
const { authenticate } = require('../middlewares/auth');
const { validateGoalCreation, validateGoalUpdate, validateProgressUpdate } = require('../validators/goalValidators');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Goal CRUD routes
router.post('/', validateGoalCreation, goalController.create);
router.get('/', goalController.getAll);
router.get('/active', goalController.getActive);
router.get('/overdue', goalController.getOverdue);
router.get('/summary', goalController.getSummary);
router.get('/search', goalController.search);
router.get('/:id', goalController.getById);
router.put('/:id', validateGoalUpdate, goalController.update);
router.delete('/:id', goalController.delete);

// Goal status management routes
router.patch('/:id/progress', validateProgressUpdate, goalController.updateProgress);
router.patch('/:id/add-progress', validateProgressUpdate, goalController.addToProgress);
router.patch('/:id/complete', goalController.complete);
router.patch('/:id/pause', goalController.pause);
router.patch('/:id/resume', goalController.resume);
router.patch('/:id/restore', goalController.restore);

// Bulk operations
router.delete('/bulk', goalController.bulkDelete);

module.exports = router;