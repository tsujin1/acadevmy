import { Request, Response } from 'express';
import Message from '../models/Message';

export function createRoomId(mentorId: string, userId: string): string {
  const ids = [mentorId, userId].sort();
  return `private_${ids[0]}_${ids[1]}`;
}

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { mentorId, userId } = req.params;
    const { limit = 50, before } = req.query;

    const roomId = createRoomId(mentorId, userId);

    const query: any = { roomId };

    if (before) {
      query.timestamp = { $lt: new Date(before as string) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    const orderedMessages = messages.reverse();

    res.json({
      success: true,
      roomId,
      count: orderedMessages.length,
      messages: orderedMessages.map(msg => ({
        id: msg._id,
        text: msg.text,
        sender: msg.senderType,
        timestamp: msg.timestamp,
        userId: msg.senderId,
        isRead: msg.isRead,
        type: msg.type || 'text',
        booking: msg.booking
      })),
      hasMore: messages.length === Number(limit),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const saveMessage = async (data: {
  roomId: string;
  senderId: string;
  senderType: 'user' | 'mentor';
  text: string;
  timestamp: Date;
  type?: 'text' | 'booking';
  booking?: any;
}) => {
  try {
    const message = await Message.create({
      roomId: data.roomId,
      senderId: data.senderId,
      senderType: data.senderType,
      text: data.text,
      timestamp: data.timestamp,
      isRead: false,
      type: data.type || 'text',
      booking: data.booking
    });

    return message;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { roomId, userId } = req.body;

    if (!roomId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'roomId and userId are required',
      });
    }

    const result = await Message.updateMany(
      {
        roomId,
        senderId: { $ne: userId },
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    res.json({
      success: true,
      markedRead: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateMessageReadStatus = async (roomId: string, userId: string) => {
  try {
    const result = await Message.updateMany(
      {
        roomId,
        senderId: { $ne: userId },
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    return result.modifiedCount;
  } catch (error) {
    console.error('Error updating read status:', error);
    throw error;
  }
};

export const getUnreadMessages = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const unreadMessages = await Message.aggregate([
      {
        $match: {
          senderId: { $ne: userId },
          roomId: { $regex: userId },
          isRead: false,
        },
      },
      {
        $group: {
          _id: '$roomId',
          count: { $sum: 1 },
          lastMessage: { $last: '$$ROOT' },
        },
      },
      {
        $sort: { 'lastMessage.timestamp': -1 },
      },
    ]);

    const totalUnread = unreadMessages.reduce((sum, room) => sum + room.count, 0);

    res.json({
      success: true,
      totalUnread,
      unreadByRoom: unreadMessages.map(room => ({
        roomId: room._id,
        count: room.count,
        lastMessage: {
          text: room.lastMessage.text,
          timestamp: room.lastMessage.timestamp,
          senderId: room.lastMessage.senderId,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread messages',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const conversations = await Message.aggregate([
      {
        $match: {
          roomId: { $regex: userId },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: '$roomId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$isRead', false] },
                    { $ne: ['$senderId', userId] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { 'lastMessage.timestamp': -1 },
      },
    ]);

    res.json({
      success: true,
      conversations: conversations.map(conv => ({
        roomId: conv._id,
        lastMessage: {
          text: conv.lastMessage.text,
          timestamp: conv.lastMessage.timestamp,
          senderId: conv.lastMessage.senderId,
          senderType: conv.lastMessage.senderType,
          type: conv.lastMessage.type
        },
        unreadCount: conv.unreadCount,
      })),
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    await Message.deleteMany({ roomId });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};