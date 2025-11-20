import express from 'express';
import {
  getChatHistory,
  markMessagesAsRead,
  getUnreadMessages,
  getUserConversations,
} from '../controllers/messageController';

const router = express.Router();

router.get('/conversations/:userId', getUserConversations);
router.get('/unread/:userId', getUnreadMessages);
router.get('/:mentorId/:userId', getChatHistory);
router.post('/mark-read', markMessagesAsRead);

export default router;