const AnalyticsService = require('../services/analyticsService');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

// ═══ GET PROJECT ANALYTICS ═══
exports.getProjectAnalytics = async (req, res) => {
  try {
    const data = await AnalyticsService.getProjectAnalytics(req.params.projectId);
    return ApiResponse.success(res, data);
  } catch (error) {
    logger.error(`Project analytics error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET DASHBOARD SUMMARY ═══
exports.getDashboardSummary = async (req, res) => {
  try {
    const data = await AnalyticsService.getDashboardSummary(req.user._id.toString());
    return ApiResponse.success(res, data);
  } catch (error) {
    logger.error(`Dashboard summary error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET ACTIVITY HEATMAP ═══
exports.getActivityHeatmap = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id.toString();
    const data = await AnalyticsService.getActivityHeatmap(userId);
    return ApiResponse.success(res, data);
  } catch (error) {
    logger.error(`Activity heatmap error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET MOOD ANALYTICS ═══
exports.getMoodAnalytics = async (req, res) => {
  try {
    const data = await AnalyticsService.getMoodAnalytics(req.params.projectId);
    return ApiResponse.success(res, data);
  } catch (error) {
    logger.error(`Mood analytics error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};