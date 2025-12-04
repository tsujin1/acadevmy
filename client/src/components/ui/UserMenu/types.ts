export interface Conversation {
  id: string;
  name: string;
  title: string;
  role: 'student' | 'mentor';
  avatar?: string;
  lastMessage?: string;
  unreadCount: number;
  mentorId: string;
  hasMessages: boolean;
}

export interface ApiConversation {
  roomId: string;
  lastMessage?: {
    sender: string;
    booking: boolean;
    type: string;
    text?: string;
    timestamp?: string;
  } | null;
  unreadCount: number;
}

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: {
    url?: string;
  };
  title?: string;
  role: 'student' | 'mentor';
}

export type NotificationType = 'review' | 'booking' | 'system' | 'info';

export interface Notification {
  id: string;
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  senderAvatar?: string;
  relatedId?: string;
  reviewId?: string;
}