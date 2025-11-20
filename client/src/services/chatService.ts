import { userService } from './userService';
import type { Mentor } from '../types/chat';
import type { User } from '../services/authService';
import type { Message } from '@/types/mentor';

export const chatService = {
  async getConversations(): Promise<Mentor[]> {
    try {
      const users = await userService.getMentors();

      const mentors: Mentor[] = users.map((user: User) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        title: user.title || 'Mentor',
        company: user.company,
        avatar: user.avatar?.url,
        isAvailable: true,
        lastMessage: 'Start a conversation...',
        lastMessageTime: new Date().toLocaleDateString(),
        unreadCount: 0
      }));

      return mentors;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  async getMessages(mentorId: string): Promise<Message[]> {
    try {
      const response = await fetch(`/api/chat/messages/${mentorId}`);
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }
};