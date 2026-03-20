const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { createProjectRules, updateProjectRules } = require('../validators/projectValidator');
const { checkProjectMember, checkProjectEditor } = require('../middleware/projectAccess');

const {
  createProject, getProjects, getProjectById, updateProject,
  deleteProject, addMember, removeMember, getProjectMembers
} = require('../controllers/projectController');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProjectRules, validate, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProjectRules, validate, updateProject)
  .delete(deleteProject);

router.get('/:id/members', getProjectMembers);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;