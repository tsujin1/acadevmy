import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('sender', 'firstName lastName avatar');

    const formatted = notifications.map(n => ({
      id: n._id,
      recipientId: n.recipient,
      type: n.type,
      title: n.title,
      message: n.message,
      isRead: n.isRead,
      createdAt: n.createdAt,
      relatedId: n.relatedId,
      senderAvatar: (n.sender as any)?.avatar?.url || (n.sender as any)?.avatar
    }));

    res.json({ notifications: formatted });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markRead = async (req: Request, res: Response) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const markAllRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateMany(
      { recipient: req.params.userId, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};