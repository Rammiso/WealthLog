const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/auth');
const { validateDashboardQuery } = require('../validators/dashboardValidators');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Dashboard analytics endpoints
router.get('/expenses-pie', validateDashboardQuery.expensesPie, dashboardController.getExpensesPie);
router.get('/income-line', validateDashboardQuery.incomeLine, dashboardController.getIncomeLine);
router.get('/category-bar', validateDashboardQuery.categoryBar, dashboardController.getCategoryBar);
router.get('/goals-progress', validateDashboardQuery.goalsProgress, dashboardController.getGoalsProgress);

// Comprehensive dashboard endpoints
router.get('/overview', validateDashboardQuery.overview, dashboardController.getDashboardOverview);
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;