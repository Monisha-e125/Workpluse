const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { createTaskRules, updateTaskRules } = require('../validators/taskValidator');

const {
  createTask, getTasks, getKanbanTasks, getTaskById,
  updateTask, updateTaskStatus, deleteTask, addComment, getMyTasks
} = require('../controllers/taskController');

router.use(protect);

router.get('/my-tasks', getMyTasks);
router.get('/kanban/:projectId', getKanbanTasks);

router.route('/')
  .get(getTasks)
  .post(createTaskRules, validate, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTaskRules, validate, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);
router.post('/:id/comments', addComment);

module.exports = router;