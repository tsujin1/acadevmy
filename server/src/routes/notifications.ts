import express from 'express';
import { getNotifications, markRead, markAllRead } from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/:userId', protect, getNotifications);
router.put('/:id/read', protect, markRead);
router.put('/read-all/:userId', protect, markAllRead);

export default router;