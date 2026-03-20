const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMessages, sendMessage, deleteMessage } = require('../controllers/chatController');

router.use(protect);

router.route('/:projectId/messages')
  .get(getMessages)
  .post(sendMessage);

router.delete('/messages/:id', deleteMessage);

module.exports = router;