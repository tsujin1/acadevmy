import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import messageRoutes from './routes/messages';
import reviewRoutes from './routes/reviews';
import notificationRoutes from './routes/notifications';

import Message from './models/Message';
import Notification from './models/Notification';
import User from './models/User';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server running', timestamp: new Date().toISOString() });
});

const userConnections = new Map<string, string>();

function createRoomId(mentorId: string, userId: string): string {
  const ids = [mentorId, userId].sort();
  return `private_${ids[0]}_${ids[1]}`;
}

const saveMessageToDB = async (data: {
  roomId: string;
  senderId: string;
  senderType: 'user' | 'mentor';
  text?: string;
  type?: 'text' | 'booking';
  booking?: any;
  timestamp: Date;
}) => {
  const finalData = { ...data, text: data.text || '' };
  return await Message.create(finalData);
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register_user', (data: { userId: string; userType: 'user' | 'mentor' }) => {
    userConnections.set(data.userId, socket.id);
    socket.join(data.userId);
  });

  socket.on('join_chat', async (data: { mentorId: string; userId: string }) => {
    try {
      const roomId = createRoomId(data.mentorId, data.userId);
      socket.join(roomId);

      const mentorSocketId = userConnections.get(data.mentorId);
      if (mentorSocketId) {
        const mentorSocket = io.sockets.sockets.get(mentorSocketId);
        if (mentorSocket && !mentorSocket.rooms.has(roomId)) {
          mentorSocket.join(roomId);
        }
      }

      const messages = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(50).lean();

      socket.emit('chat_history', {
        roomId,
        messages: messages.map(msg => ({
          id: msg._id.toString(),
          text: msg.text,
          sender: msg.senderType,
          timestamp: msg.timestamp.toISOString(),
          userId: msg.senderId,
          isRead: msg.isRead,
          type: msg.type || 'text',
          booking: msg.booking,
        })),
      });
    } catch (error) {
      console.error('Error in join_chat:', error);
    }
  });

  socket.on('send_message', async (data) => {
    try {
      const roomId = createRoomId(data.mentorId, data.userId);

      const savedMessage = await saveMessageToDB({
        roomId,
        senderId: data.userId,
        senderType: 'user',
        text: data.message,
        type: data.type || 'text',
        booking: data.booking,
        timestamp: new Date(data.timestamp),
      });

      const messageData = {
        id: savedMessage._id,
        text: savedMessage.text,
        sender: 'user',
        type: savedMessage.type,
        booking: savedMessage.booking,
        timestamp: savedMessage.timestamp,
        userId: savedMessage.senderId,
        socketId: socket.id,
        roomId: roomId,
        isRead: savedMessage.isRead,
      };

      io.to(roomId).emit('receive_message', messageData);

      const mentorSocketId = userConnections.get(data.mentorId);
      if (!mentorSocketId || !io.sockets.sockets.get(mentorSocketId)) {
        socket.emit('message_queued', { messageId: savedMessage._id, recipient: data.mentorId });
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('mentor_reply', async (data) => {
    try {
      const roomId = createRoomId(data.mentorId, data.userId);

      const savedMessage = await saveMessageToDB({
        roomId,
        senderId: data.mentorId,
        senderType: 'mentor',
        text: data.message,
        type: data.type || 'text',
        booking: data.booking,
        timestamp: new Date(data.timestamp),
      });

      const messageData = {
        id: savedMessage._id,
        text: savedMessage.text,
        sender: 'mentor',
        type: savedMessage.type,
        booking: savedMessage.booking,
        timestamp: savedMessage.timestamp,
        userId: savedMessage.senderId,
        socketId: socket.id,
        roomId: roomId,
        isRead: savedMessage.isRead,
      };

      io.to(roomId).emit('receive_message', messageData);

      const userSocketId = userConnections.get(data.userId);
      if (!userSocketId || !io.sockets.sockets.get(userSocketId)) {
        socket.emit('message_queued', { messageId: savedMessage._id, recipient: data.userId });
      }
    } catch (error) {
      console.error('Error saving reply:', error);
    }
  });

  socket.on('update_booking_status', async (data: {
    messageId: string;
    status: 'accepted' | 'declined' | 'completed';
    meetingLink?: string
  }) => {
    try {
      const message = await Message.findById(data.messageId);

      if (message && message.booking) {
        message.booking.status = data.status;

        if (data.meetingLink) {
          message.booking.meetingLink = data.meetingLink;
        }

        await message.save();

        io.to(message.roomId).emit('booking_updated', {
          messageId: message._id,
          booking: message.booking
        });

        if (data.status === 'completed') {
          const studentId = message.senderId;
          const mentorId = message.roomId.replace(`private_`, '').replace(studentId, '').replace('_', '');

          const mentor = await User.findById(mentorId);
          const mentorName = mentor ? `${mentor.firstName} ${mentor.lastName}` : 'Your Mentor';

          const thankYouMessage = await saveMessageToDB({
            roomId: message.roomId,
            senderId: mentorId,
            senderType: 'mentor',
            text: `Thank you for completing the session! I hope it was helpful. Please take a moment to leave a review.`,
            type: 'text',
            timestamp: new Date()
          });

          io.to(message.roomId).emit('receive_message', {
            id: thankYouMessage._id,
            text: thankYouMessage.text,
            sender: 'mentor',
            type: 'text',
            timestamp: thankYouMessage.timestamp,
            userId: thankYouMessage.senderId,
            socketId: null,
            roomId: message.roomId,
            isRead: false,
          });

          const notification = await Notification.create({
            recipient: studentId,
            sender: mentorId,
            type: 'review',
            title: 'Session Completed',
            message: `How was your session with ${mentorName}? Click here to leave a review!`,
            isRead: false,
            relatedId: mentorId
          });

          io.to(studentId).emit('newNotification', {
            id: notification._id,
            type: 'review',
            title: notification.title,
            message: notification.message,
            createdAt: notification.createdAt,
            isRead: false,
            relatedId: mentorId,
            senderAvatar: (mentor as any)?.avatar?.url || (mentor as any)?.avatar
          });
        }
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  });

  socket.on('mark_as_read', async (data) => {
    try {
      const result = await Message.updateMany(
        { roomId: data.roomId, senderId: { $ne: data.userId }, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );

      io.to(data.roomId).emit('messages_read', {
        roomId: data.roomId,
        readBy: data.userId,
        updatedCount: result.modifiedCount
      });
    } catch (error) {
      console.error('Error marking read:', error);
    }
  });

  socket.on('typing_start', (data) => {
    socket.to(data.roomId).emit('user_typing', { userId: data.userId, isTyping: true });
  });

  socket.on('typing_stop', (data) => {
    socket.to(data.roomId).emit('user_typing', { userId: data.userId, isTyping: false });
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of userConnections.entries()) {
      if (socketId === socket.id) {
        userConnections.delete(userId);
        break;
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});