const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { moodCheckInRules } = require('../validators/moodValidator');
const { submitMood, getMyMoodHistory, getTeamMood } = require('../controllers/moodController');

router.use(protect);

router.post('/check-in', moodCheckInRules, validate, submitMood);
router.get('/history', getMyMoodHistory);
router.get('/team/:projectId', getTeamMood);

module.exports = router;