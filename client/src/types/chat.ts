export interface Mentor {
  _id?: string;
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role?: 'student' | 'mentor';
  title: string;
  company?: string;
  avatar?: string;
  isAvailable: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}