import express from 'express';
import {
  getChatHistory,
  markMessagesAsRead,
  getUnreadMessages,
  getUserConversations,
  deleteConversation,
} from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/conversations/:userId', protect, getUserConversations);
router.get('/unread/:userId', protect, getUnreadMessages);
router.get('/:mentorId/:userId', protect, getChatHistory);
router.post('/mark-read', protect, markMessagesAsRead);
router.delete('/conversation/:roomId', protect, deleteConversation);

export default router;