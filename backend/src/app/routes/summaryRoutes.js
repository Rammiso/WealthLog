const express = require('express');
const goalController = require('../controllers/goalController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Monthly summary route
router.get('/monthly', goalController.getMonthlySummaryReport);

module.exports = router;