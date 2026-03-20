const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProjectAnalytics, getDashboardSummary,
  getActivityHeatmap, getMoodAnalytics
} = require('../controllers/analyticsController');

router.use(protect);

router.get('/dashboard', getDashboardSummary);
router.get('/project/:projectId', getProjectAnalytics);
router.get('/heatmap/:userId?', getActivityHeatmap);
router.get('/mood/:projectId', getMoodAnalytics);

module.exports = router;