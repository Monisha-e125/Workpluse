const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createSprint, getSprints, startSprint, completeSprint
} = require('../controllers/sprintController');

router.use(protect);

router.route('/:projectId/sprints')
  .get(getSprints)
  .post(createSprint);

router.patch('/:projectId/sprints/:sprintId/start', startSprint);
router.patch('/:projectId/sprints/:sprintId/complete', completeSprint);

module.exports = router;