import { createContext } from 'react';
import type { Mentor } from '../types/chat';

export interface ChatContextType {
  isChatOpen: boolean;
  currentMentor: Mentor | null;
  conversations: Mentor[];
  unreadCount: number;
  openChat: (mentor: Mentor) => void;
  closeChat: () => void;
  loadConversations: () => Promise<void>;
  refreshConversations: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);