import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.user?.id;

    // Verify the authenticated user matches the userId in the request
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return res.status(403).json({ 
        message: 'Not authorized to access these notifications' 
      });
    }

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

export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify the notification belongs to the authenticated user
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== authenticatedUserId) {
      return res.status(403).json({ 
        message: 'Not authorized to mark this notification as read' 
      });
    }

    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const markAllRead = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.user?.id;

    // Verify the authenticated user matches the userId in the request
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return res.status(403).json({ 
        message: 'Not authorized to mark notifications as read' 
      });
    }

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify the notification belongs to the authenticated user
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== authenticatedUserId) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this notification' 
      });
    }

    await Notification.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification' });
  }
};