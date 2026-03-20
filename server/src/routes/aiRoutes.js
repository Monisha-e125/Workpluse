const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  autoAssignTask, getWorkloadAnalysis, getBurnoutRisk,
  getTeamBurnout, getSkillMatch, getSprintPrediction
} = require('../controllers/aiController');

router.use(protect);

router.post('/auto-assign', autoAssignTask);
router.get('/workload/:projectId', getWorkloadAnalysis);
router.get('/burnout/:userId', getBurnoutRisk);
router.get('/burnout/team/:projectId', getTeamBurnout);
router.get('/skill-match/:projectId', getSkillMatch);
router.get('/sprint-prediction/:projectId/:sprintId', getSprintPrediction);

module.exports = router;