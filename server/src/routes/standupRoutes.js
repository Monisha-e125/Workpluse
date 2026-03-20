const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateStandup, getStandups, getLatestStandup } = require('../controllers/standupController');

router.use(protect);

router.post('/:projectId/generate', generateStandup);
router.get('/:projectId', getStandups);
router.get('/:projectId/latest', getLatestStandup);

module.exports = router;