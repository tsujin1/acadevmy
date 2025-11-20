export interface Mentor {
  _id?: string;
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  title: string;
  company?: string;
  avatar?: string;
  isAvailable: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}