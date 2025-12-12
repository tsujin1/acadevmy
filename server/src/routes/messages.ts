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

router.get('/conversations/:userId', getUserConversations);
router.get('/unread/:userId', getUnreadMessages);
router.get('/:mentorId/:userId', getChatHistory);
router.post('/mark-read', markMessagesAsRead);
router.delete('/conversation/:roomId', protect, deleteConversation);

export default router;